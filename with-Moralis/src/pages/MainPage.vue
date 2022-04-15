<template>
 <div>
   <NFTList
    :items="paginatedItems"
    @buyItem="buyItem"
    @closeOffer="closeOffer"
  />
   <BasePagination v-model="page" :count="offersNumber" :per-page="itemsPerPage"/>
 </div>
</template>

<script>
const ethers = Moralis.web3Library;
import marketplaceAbi from '@/util/constants/marketplaceAbi';
import nftAbi from '@/util/constants/nftAbi';
import NFTList from '@/components/NFTList.vue';
import BasePagination from '@/components/UI/BasePagination.vue';
import Moralis from 'moralis';

export default {
  components: {
    NFTList,
    BasePagination,
  },
  data() {
    return {
      data: null,
      offers: [],
      offersNumber: null,
      page: 1,
      itemsPerPage: 6,
      nftContract: '0x2679771550B3dC32223fC4833a0495eA91B88E2A',
      marketplaceContract: '0x44501fB845268Aa9f62B86e06827068E479A854e',
    };
  },
  computed: {
    paginatedItems() {
      let paginatedOffers = [];
      let itemIdFrom = (this.page - 1) * this.itemsPerPage;
      let itemIdTo = this.page * this.itemsPerPage < this.offers.length ? this.page * this.itemsPerPage : this.offers.length;
      if (this.offers.length > 0) {
        for (let i = itemIdFrom; i < itemIdTo; i++) {
          paginatedOffers.push(this.offers[i]);
        }
      }
      return paginatedOffers;
    },
    provider() {
      return new ethers.providers.Web3Provider(window.ethereum);
    },
    signer() {
      return this.provider.getSigner();
    },
    marketplaceAbi() {
      return marketplaceAbi;
    },
    nftAbi() {
      return nftAbi;
    },
    marketContractToGet() {
      return new ethers.Contract(this.marketplaceContract, this.marketplaceAbi, this.provider);
    },
    marketContractToWrite() {
      return this.marketContractToGet.connect(this.signer);
    },
    nftContractToGet() {
      return new ethers.Contract(this.nftContract, this.nftAbi, this.provider);
    },
    nftContractToWrite() {
      return this.nftContractToGet.connect(this.signer);
    },
    itemIdFrom() {
      return (this.page - 1) * this.itemsPerPage;
    },
    itemIdTo() {
      return this.page * this.itemsPerPage > this.offersNumber ? this.offersNumber : this.page * this.itemsPerPage;
    },
  },
  methods: {
    getOffersNumber() {
      this.marketContractToGet.functions.offerCount()
      .then((resp) => {
        this.offersNumber = parseInt(resp[0]._hex, 16);
        this.$store.commit('updateOffersNumber', this.offersNumber);
      });
    },
    getOffers() {
      if (this.offersNumber !== null) {
        for (let i = 0; i < this.offersNumber; i++) {
          this.marketContractToGet.functions.offers(i)
          .then((res) => {
            const query = new Moralis.Query('Offer');
            query.equalTo('offerId', i);
            query.find()
            .then((result) => {
              if (!result[0]) {
                const off = new Moralis.Object('Offer');
                off.set('offerId', i);
                off.set('creator', res.creator);
                off.set('owner', res.owner);
                off.set('hostContract', res.hostContract);
                off.set('tokenId', parseInt(res.tokenId._hex, 16));
                off.set('price', parseInt(res.price._hex, 16));
                off.set('tokenURI', res.uri);
                off.set('royalty', parseInt(res.royaltyAmount._hex, 16));
                fetch(res.uri).then((response) => {
                  response.json().then((result) => {
                    off.set('picture', result.picture);
                    off.set('name', result.name);
                    off.set('fandom', result.fandom);
                  }).catch((error) => {
                    console.log(error.message);
                  });
                });
                off.save();
              }
            });
          });
        }
      }
    },
    async getOffersInfo() {
      this.offers = [];
      const query = new Moralis.Query('Offer');
      query.ascending('offerId');
      const results = await query.find();
      for (let i = 0; i < results.length; i++) {
        let offer = results[i];
        offer.price = offer.get('price');
        offer.owner = offer.get('owner');
        offer.creator = offer.get('creator');
        offer.tokenId = offer.get('tokenId');
        offer.tokenURI = offer.get('tokenURI');
        offer.offerId = offer.get('offerId');
        offer.royalty = offer.get('royalty');
        fetch(offer.tokenURI).then((response) => {
          response.json().then((result) => {
            offer.picture = result.picture;
            offer.name = result.name;
            offer.fandom = result.fandom;
          }).catch((error) => {
            console.log(error.message);
          });
        });
      }
      this.offers = results;
    },
    buyItem(offerId, price) {
      let fixedPrice = (+price * (10 ** (-18))).toString();
      this.marketContractToWrite.closeOffer(offerId, {value: fixedPrice}) //преобразование в строку, потому что большое число вызывает ошибку
      .then(() => {
        const query = new Moralis.Query('Offer'); //затем ставим пометку о закрытии в базе данных
        query.equalTo('offerId', offerId);
        query.find().then((result) => {
          let closedOffer = result[0];
          closedOffer.destroy().then(() => {alert('Успешный успех!')}).catch((error) => {console.log(error.message)});
        });
      })
      .catch((error) => {
        alert(error.message);
      });
    },
    closeOffer(offerId) {
      const query = new Moralis.Query('Offer');
      query.equalTo('offerId', offerId);
      query.find().then((result) => {
        let offer = result[0];
        offer.destroy();
        this.marketContractToWrite.functions.removeFromSale(offerId);
        alert('Обновите страницу после подтверждения транзакции Метамаском');
      });
    },
    loadPage() {
      this.getOffersNumber();
      setTimeout(() => {
        this.getOffers();
      }, 3000);
      this.getOffersInfo();
    }
  },
  created() {
    this.loadPage();
  },
};
</script>
