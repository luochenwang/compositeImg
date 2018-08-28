$(function () {
    

        // 生成
        $(".generate").on("click",function(){
            $("#view").show().prop("src",imgMergeN.export())
        })
        // 关闭
        $("#view").on("click",function(){
            $(this).toggle();
        })
   



})