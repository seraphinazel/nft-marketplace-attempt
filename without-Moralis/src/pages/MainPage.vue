<template>
 <div>
   <NFTList :items="offers" @buyItem="buyItem"/>
   <BasePagination v-model="page" :count="offersNumber" :per-page="itemsPerPage"/>
 </div>
</template>

<script>
import { ethers } from 'ethers';
import marketplaceAbi from '@/util/constants/marketplaceAbi';
import nftAbi from '@/util/constants/nftAbi';
import NFTList from '@/components/NFTList.vue';
import BasePagination from '@/components/UI/BasePagination.vue';

export default {
  components: {
    NFTList,
    BasePagination,
  },
  data() {
    return {
      nftContract: '0x6896636369961c5A0C7Cf078BF756DC378c7a132',
      marketplaceContract: '0x5e94731eFe78F935d38cC6245c9f62056cF27D98',
      offers: [],
      offersNumber: null,
      page: 1,
      itemsPerPage: 10,
    };
  },
  computed: {
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
    itemIdFrom() {
      return (this.page - 1) * this.itemsPerPage;
    },
    itemIdTo() {
      return this.page * this.itemsPerPage > this.offersNumber ? this.offersNumber : this.page * this.itemsPerPage;
    },
  },
  methods: {
    getOffersNumber() {
      this.marketContractToGet.functions.offeringNonce()
      .then((resp) => {
        this.offersNumber = parseInt(resp[0]._hex, 16);
      });
    },
    getOffersInfo() {
      this.offers = [];
      if (this.offersNumber !== null) {
        for (let i = this.itemIdFrom; i < this.itemIdTo; i++) {
          let offer = {};
          this.marketContractToGet.functions.offersids(i)
          .then((response) => {
            offer.id = response[0];
            this.marketContractToGet.functions.offeringRegistry(response[0])
            .then((res) => {
              offer.offerer = res.offerer;
              offer.hostContract = res.hostContract; //это адрес непосредственно контракта NFT - по нему обращаемся к нфт и берем данные о нем
              offer.tokenId = parseInt(res.tokenId._hex, 16);
              offer.price = parseInt(res.price._hex, 16).toString();
              offer.closed = res.closed;
              this.nftContractToGet.functions.tokenURI(parseInt(res.tokenId._hex, 16))
              .then((result) => {
                offer.tokenURI = result;
                this.offers.push(offer);
              });
            });
          });
        }
      }
      this.$store.commit('updateOffers', this.offers); //кладём загруженные офферы в хранилище, чтобы оттуда брать данные для каждого НФТ (для его страницы)
    },
    buyItem(id, price) {
      this.marketContractToWrite.closeOffer(id, {value: price});
      /* setTimeout(() => {
      this.getOffersInfo();
      }, 0); */
    },
  },
  watch: {
    page() {
      this.getOffersInfo();
    },
  },
  created() {
    this.getOffersNumber();
    setTimeout(() => {
      this.getOffersInfo();
    }, 3000);
  },
};
</script>
