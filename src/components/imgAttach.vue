<!--图片上传-->
<template>
    <div>
        <div v-show="attach.url" class="img-content">
            <img :src="attach.url">
            <div>
                <el-button type="text" @click="handleReupload" v-show="!view">重新上传</el-button>
            </div>
        </div>
        <div v-show="!attach.url" class="upload_file">
            <el-upload accept="image/*"
                class="avatar-uploader"
                ref="upload"
                :action="options.uploadUrl"
                :show-file-list="false"
                :on-success="uploadOnSuccess">
                <i class="el-icon-plus img-uploader-icon" :id="id" style="font-size: 28px;line-height: 178px;"></i>
            </el-upload>
        </div>
    </div>
</template>

<script>
export default{
    name: 'upload-list',
    props:{
        view: {
            type: Boolean,
            default: false
        },
        attach: {
            type: Object
        },
        // 每上传完一个文件时触发的事件
        onUploaded: {
            type: Function
        }
    },
    data(){
        return {
            id:"",
            options:{
                uploadUrl: this.$url + 'image/upload'
            },
        }
    },
    created(){
        this.id = this.uuid();
    },
    methods: {
        //重新上传
        handleReupload() {
            document.getElementById(this.id).click();
        },
        //上传成功
        uploadOnSuccess(res,file){//上传附件
            if(res.code == 200) {
                this.attach.url = this.$imgUrl+res.data.downloadUrl;
                if(this.onUploaded){
                    this.onUploaded(res.data);
                }
            }
            else {
                this.$message({
                    message: res.msg,
                    type: "error"
                });
            }
        },
        uuid() {
            var s = [];
            var hexDigits = "0123456789abcdef";
            for (var i = 0; i < 36; i++) {
                s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
            }
            s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
            s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
            s[8] = s[13] = s[18] = s[23] = "-";
            var uuid = s.join("");
            return uuid;
        },
    }
}
</script>

<style>

.img-content img{
    width:220px;
    height:250px;
    margin:5px 20px 10px 0;
    border:1px solid #d1dbe5;
    border-radius:4px;
}

.img-content div {
    text-align: center;
}

.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    width:220px;
    height:220px;
}

.avatar-uploader .el-upload:hover {
    border-color: #409EFF;
}

.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width:220px;
    height:220px;
    line-height: 178px;
    text-align: center;
}

</style>
