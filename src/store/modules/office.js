const office = {
    state:{
        mode:'',
        type:'',
        documentType:'',
        document: {},
        editorConfig: {},
    },
    mutations:{
        SET_MODE:(state,payload)=>{
            console.log("set mode run")
            state.mode = payload;
        },
        SET_TYPE:(state,payload)=>{
            state.type = payload;
        },
        SET_DOCUMENTTYPE:(state,payload)=>{
            state.documentType = payload;
        },
        SET_DOCUMENT:(state,payload)=>{
            state.document = payload;
        },
        SET_EDITORCONFIG:(state,payload)=>{
            state.editorConfig = payload;
        }
    },
    actions:{
        setMode:({commit},paramsObj)=>{
            commit('SET_MODE',paramsObj)
        },
        setType:({commit},paramsObj)=>{
            commit('SET_TYPE',paramsObj)
        },
        setDocumentType:({commit},paramsObj)=>{
            commit('SET_DOCUMENTTYPE',paramsObj)
        },
        setDocument:({commit},paramsObj)=>{
            commit('SET_DOCUMENT',paramsObj)
        },
        setEditorConfig:({commit},paramsObj)=>{
            commit('SET_EDITORCONFIG',paramsObj)
        }
    }
}
