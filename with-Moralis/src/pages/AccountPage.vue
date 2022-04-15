<template>
  <div>
    <div v-if="user == null">
      <h1>Пожалуйста, подключитесь к кошельку!</h1>
    </div>
    <div v-else>
      <MintNFT :creator='user' @mint="mintNFT"/>
      <div class="nfts_wrapper">
        <AccountNFTItem
          class="nft_item"
          v-for="item in accountNFTs"
          :key="item.token_id"
          :item="item"
          :user="user"
          @approveItem="approveItem"
          @createOffer="createOffer"
        />
      </div>
    </div>
  </div>
</template>

<script>
import Moralis from 'moralis';
const ethers = Moralis.web3Library;
import marketplaceAbi from '@/util/constants/marketplaceAbi';
import nftAbi from '@/util/constants/nftAbi';
import AccountNFTItem from '@/components/AccountNFTItem.vue';
import MintNFT from '@/components/MintNFT.vue';

export default {
  components: { AccountNFTItem, MintNFT },
  data() {
    return {
      accountNFTs: [],
      tokenURI: null,
      offerPrice: null,
      nftContract: '0x2679771550B3dC32223fC4833a0495eA91B88E2A',
      marketplaceContract: '0x44501fB845268Aa9f62B86e06827068E479A854e', 
    };
  },
  computed: {
    user() {
      return this.$store.state.account;
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
  },
  methods: {
    getAccountNFT() {
      if (this.user !== null) {
        const options = {
          chain: "bsc testnet",
          address: this.user,
          token_address: this.nftContract
        };
        Moralis.Web3API.account.getNFTsForContract(options)
        .then((response) => {
          this.accountNFTs = response.result;
          this.accountNFTs.forEach((res) => {
            this.nftContractToGet.getApproved(res.token_id)
            .then((resolve) => {
              resolve == this.marketplaceContract ? res.isApproved = true : res.isApproved = false;
            });
            this.checkItemForOffers(res.token_id)
            .then((result) => {
              if (result === undefined) {
                res.active = false;
              } else {
                res.active = result.active;
                res.offerId = result.offerId;
                res.creator = result.creator.toLowerCase();
              }
            });
            this.nftContractToGet.getNftCreator(res.token_id)
            .then((resp) => {
              res.creator = resp.toLowerCase();
            });
          });
        })
        .catch((error) => {
          alert(error.message);
        });
      }
    },
    mintNFT(data) {
      this.nftContractToWrite.mint(data)
      .then(() => {
        alert('Пожалуйста, обновите страницу ПОСЛЕ подтверждения выполнения транзакции Метамаском');
      })
      .catch((error) => {
        alert(error.message);
      });
    },
    approveItem(token_id) {
      this.nftContractToWrite.approve(this.marketplaceContract, token_id)
      .then(() => {
        alert('Пожалуйста, обновите страницу ПОСЛЕ подтверждения выполнения транзакции Метамаском');
      })
      .catch((error) => {
        alert(error.message);
      });
    },
    async checkItemForOffers(tokenId) {
      const query = new Moralis.Query('Offer');
      query.equalTo('tokenId', +tokenId); //перебираем все по токену, закрытые и открытые, потому что нужен создатель
      const results = await query.find();
      let offer = results[results.length - 1]; //берем последний имеющийся оффер этого токена
      if (offer !== undefined) {
        offer.offerId = offer.get('offerId');
        offer.creator = offer.get('creator');
        offer.active = offer.get('active');
      }
      return offer;
    },
    createOffer(tokenId, price, royalty) {
      this.marketContractToWrite.functions.createOffer(this.nftContract, tokenId, price, royalty);
      //нужно попробовать повесить слушатели от Моралиса на контракт маркетплейса
    },
  },
  watch: {
    user() {
      this.getAccountNFT();
    },
  },
  created() {
    this.getAccountNFT();
  },
};
</script>

<style scoped>
.nfts_wrapper {
  display: flex;
  flex-wrap: wrap;
  padding: 20px;
}
.nft_item {
  width: 500px;
  margin: 20px;
  padding: 15px;
  border: 1px solid teal;
  border-radius: 10px;
}
</style>