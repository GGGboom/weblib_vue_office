<template>
  <div id="monitorOffice"></div>
</template>
<script>
export default {
  name: 'monitorOffice',
  props: {
    option: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      doctype: ''
    }
  },
  mounted() {
    this.setEditor(this.option);
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
  }
}
</script>
