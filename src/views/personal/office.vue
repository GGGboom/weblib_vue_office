<template>
  <div>
    <div id="monitorOffice">
    </div>
  </div>

</template>
<script>
import request from "../../utils/request";

export default {
  name: 'office',
  data() {
    return {
      config: {},
    }
  },
  methods: {
    setEditor(config) {
      // office配置参数
      let editConfig = {
        type: config.type,
        documentType: config.documentType,
        document: config.document,
        editorConfig: config.editorConfig,
        height: "1000px",
      };
      let docEditor = new DocsAPI.DocEditor("monitorOffice", editConfig);
    },
    getOffice(id) {
      request({
        url: '/office/preview',
        method: 'get',
        params: {
          id: id
        }
      }).then(data=>{
        let config = data.data.model;
        this.config = data.data.model;
        console.log(this.config)
        localStorage.setItem("office", JSON.stringify(config));
      }).catch(err=>{
        console.log(err);
      })

    }
  },
  created() {
    console.log("office")
    this.config = JSON.parse(localStorage.getItem("office"));
  },
  mounted() {
    this.setEditor(this.config);
  },

}

</script>

<style scoped>

</style>
