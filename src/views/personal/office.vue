<template>
  <div id="monitorOffice" style="z-index: -9999">
  </div>
</template>
<script>
export default {
  name: 'office',
  data() {
    return {
      config: {},
      docEditor:{}
    }
  },
  methods: {
    setEditor(config) {
      let editConfig = {
        type: config.type,
        documentType: config.documentType,
        document: config.document,
        editorConfig: config.editorConfig,
        width:"100%",
        height: "100%",
      };
      this.docEditor = new DocsAPI.DocEditor("monitorOffice", editConfig);
    }
  },
  created() {
  },
  mounted() {
    this.$root.$on('open-office', (data) => {
      this.config = data.config;
      this.setEditor(this.config);
    });
  },
  destroyed() {
    this.docEditor.destroyEditor();
    document.getElementById("monitorOffice").remove();
  }
}

</script>

<style scoped>

</style>
