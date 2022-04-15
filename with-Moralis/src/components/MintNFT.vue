<template>  
  <div class="mint">
    <input type="file" @change="uploadPicture($event)"/>
    <input type="text" v-model="name" placeholder="name"/>
    <input type="text" v-model="fandom" placeholder="fandom"/>
    <button @click="mintNFT" :disabled="picture == null || name == null || fandom == null">Mint NFT</button>
  </div>
</template>

<script>
import Moralis from 'moralis';

export default {
  props: {
    creator: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      picture: null,
      name: null,
      fandom: null,
      pictureLink: null,
    };
  },
  methods: {
    uploadPicture(event) {
      this.picture = event.target.files[0];
    },
    mintNFT() {
      const name = "photo.jpg";
      const moralisFile = new Moralis.File(name, this.picture);
      moralisFile.saveIPFS().then(() => {
        this.pictureLink = moralisFile.ipfs();
        const object = {
          name: this.name,
          fandom: this.fandom,
          picture: this.pictureLink
        };
        const fileName = 'tokenURI.json';
        const dataFile = new Moralis.File(fileName, {base64 : btoa(JSON.stringify(object))});//принимает в таком виде только латиницу
        dataFile.saveIPFS().then(() => {
          const tokenURI = dataFile.ipfs();
          this.$emit('mint', tokenURI);
        });
      });
    },
  },
};
</script>

<style scoped>
.mint {
  width: 450px;
  display: flex;
  flex-direction: column;
  padding: 20px;
}
</style>