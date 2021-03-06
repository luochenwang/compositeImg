# compositeImg
图片合成，编辑

我是使用createjs里面的 easeljs.js和手势插件hammer.js封装的一个图片合成和编辑功能，如果只是简单的合成只需要引入easeljs。

*注：
    1.此功能暂时只支持移动端
    2.如果需要编辑的时候，必须要把自适应做好，不然编辑的时候移动会出现偏差



# 合成图片
``` bash
var imgMergeN = new imgMerge({
    // 如果canvasEl不传 默认会创建一个离线canvas去生成。
    canvasEl: canvas,   // canvas
    cWidth:750,         // canvas的宽度
    cHeight:1208,       // canvas的高度
    parentBoxEl:dom,    // 父级的类如果填写会根据的父级的宽高自适应  ‘.warp’ || '#warp'
    align:'center',     // 等比例图片剧中  当图片宽度或者高度超过屏幕，根据比例等比例缩小铺满屏幕  注：仅对图片有效
    bgColor:'#fff',     // 背景色
    data: [{ 
            val: './img/slide2.jpg',  // 图片地址   *必传
            zIndex: 1,  // 层级
            id: "bg"
        },
        {
            val: '名称',   // 文字   *必传
            x: 304,
            y: 45,
            fontSize:"42px",        // 字体大小
            color:"#ffe42c",        // 字体颜色
            zIndex: 51,             // 层级
            id: "tt",               // id 唯一值
            fontAlign:"center"      // x轴对齐
        }
    ],
    //  初始化完的callback
    firstAllLoadEnd:function(){   
        console.log("全部加载完成!");
    }
});
```

# 图片编辑
``` bash
var imgMergeN = new imgMerge({
    canvasEl: canvas,   // canvas
    cWidth:750,         // canvas的宽度
    cHeight:1208,       // canvas的高度
    moveIndex: "upimg", // 要编辑的id
    parentBoxEl:dom,    // 父级的类如果填写会根据的父级的宽高自适应  ‘.warp’ || '#warp'
    align:'center',     // 等比例图片剧中  当图片宽度或者高度超过屏幕，根据比例等比例缩小铺满屏幕  注：仅对图片有效
    bgColor:'#fff',     // 背景色
    data: [{ 
            val: './img/slide2.jpg',  // 图片地址   *必传
            zIndex: 1,  // 层级
            id: "bg",  // id 唯一值
            callback:function(){
                // 添加成功的回调函数
            }
        },
        {
            val: '名称',   // 文字   *必传
            x: 304,
            y: 45,
            fontSize:"42px",        // 字体大小
            color:"#ffe42c",        // 字体颜色
            zIndex: 51,             // 层级
            id: "tt",               // id 唯一值
            fontAlign:"center",      // x轴对齐
            callback:function(){
                // 添加成功的回调函数
            }
        }
    ],
    //  初始化完的callback
    allLoadEnd:function(){   
        console.log("全部加载完成!");
    }
});
```


# api
添加图片
``` bash
 /*
  *  单个传入对象
  *  多个传入数组对象
  */
var data = {
    val: './img/logo3.png',
    x: 0,
    y: 0,
    zIndex: 51,
    id: "logo",
    callback:function(){
        // 添加成功的回调函数
    }
};
imgMergeN.addData(data);
```

改变编辑的元素
``` bash
// 替换编辑的元素 传入要替换编辑的id（索引也可以，不过建议传入id）
imgMergeN.changeMoveImg(id);
```

删除画布上的内容
``` bash
// 删除画布上的元素,如果不传默认删除全部的内容（传索引也可以，不过建议传入id）
imgMergeN.removeData();
```

转base64
``` bash
imgMergeN.export();
```

刷新画布
``` bash
imgMergeN.update();
```


移除移动事件并删除画布内容（删除了画布的内容，画布还有内容是因为删除以后并没有更新画布，如果要更新执行update）
``` bash
imgMergeN.destroy();
```

