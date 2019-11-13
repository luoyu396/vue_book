<template id="treeSelect">
    <el-select :value="valueTitle" :clearable="clearable" :disabled="disabled" @clear="clearHandle" ref="els">
        <el-option :value="valueTitle" :label="valueTitle">
            <el-tree
                    ref="selectTree"
                    :accordion="accordion"
                    :data="options"
                    :props="props"
                    :node-key="props.value"
                    :default-expanded-keys="defaultExpandedKey"
                    @node-click="handleNodeClick">
            </el-tree>
        </el-option>
    </el-select>
</template>
<script>
export default {
    template: '#treeSelect',
    props:{
        /* 配置项 */
        props:{
            type: Object,
            default:()=>{
                return {
                    value:'id',             // ID字段名
                    label: 'label',         // 显示名称
                    children: 'children'    // 子级字段名
                }
            }
        },
        /* 选项列表数据(树形结构的对象数组) */
        options:{
            type: Array,
            default: ()=>{ return [] }
        },
        /* 初始值 */
        value:{
            type: String,
            default: ()=>{ return null }
        },
        /* 可清空选项 */
        clearable:{
            type:Boolean,
            default:()=>{ return true }
        },
        /* 自动收起 */
        accordion:{
            type:Boolean,
            default:()=>{
                    return false
                }
        },
        /* 是否禁用选项 */
        disabled:{
            type:Boolean,
            default:()=>{ return false }
        }
    },
    data() {
        return {
            valueId:this.value,    // 初始值
            valueTitle:'',
            defaultExpandedKey:[]
        }
    },
    mounted(){
        this.initHandle()
    },
    methods: {
        // 初始化值
        initHandle(){
            if(this.valueId){
                if(this.$refs.selectTree.getNode(this.valueId) != null) {
                    this.valueTitle = this.$refs.selectTree.getNode(this.valueId).data.label     // 初始化显示
                    this.$refs.selectTree.setCurrentKey(this.valueId)       // 设置默认选中
                    this.defaultExpandedKey = [this.valueId]      // 设置默认展开
                }
            }
        },
        // 切换选项
        handleNodeClick(node){
            this.valueTitle = node[this.props.label]
            this.valueId = node[this.props.value]
            this.$emit('getvalue',this.valueId)
            this.defaultExpandedKey = [];
            if(node.children == null || node.children.length == 0){
                this.$refs.els.blur();
            }
        },
        // 清除选中
        clearHandle(){
            this.valueTitle = ''
            this.valueId = null
            this.defaultExpandedKey = []
            this.$refs.selectTree.setCurrentKey(null)       // 设置默认选中
            this.$emit('getvalue',null)
        }
    },
    watch: {
        value(){
            this.valueId = this.value
            this.initHandle()
        }
    }
}
</script>
<style scoped>
    .el-scrollbar .el-scrollbar__view .el-select-dropdown__item{
        height: auto;
        padding: 0;
    }
    .el-select-dropdown__item.selected{
        font-weight: normal;
    }
    ul li >>>.el-tree .el-tree-node__content{
        height:auto;
    }
    .el-tree-node__label{
        font-weight: normal;
    }
    .el-tree >>>.is-current .el-tree-node__label{
        color: #409EFF;
        font-weight: 700;
    }
    .el-tree >>>.is-current .el-tree-node__children .el-tree-node__label{
        color:#606266;
        font-weight: normal;
    }
</style>
