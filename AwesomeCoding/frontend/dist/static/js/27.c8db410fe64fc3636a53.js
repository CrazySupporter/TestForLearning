webpackJsonp([27],{"/gMV":function(t,e,a){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var n={render:function(){var t=this.$createElement,e=this._self._c||t;return e("el-table",{staticStyle:{width:"100%"},attrs:{data:this.tableData,stripe:""},on:{"current-change":this.handleCurrentChange}},[e("el-table-column",{attrs:{prop:"showFilename",label:"文件名",width:"180"}})],1)},staticRenderFns:[]},l=a("VU/8")({data:function(){return{tableData:[]}},mounted:function(){this.$http.post("/api/file/fetch",{}).then(function(t){this.tableData=t.body.results;for(var e=0;e<this.tableData.length;e++)this.tableData[e].showFilename=this.tableData[e].filename.split(" ")[2]})},methods:{handleCurrentChange:function(t){this.$router.push({name:"file",params:{file_id:t.id}})}}},n,!1,null,null,null);e.default=l.exports}});
//# sourceMappingURL=27.c8db410fe64fc3636a53.js.map