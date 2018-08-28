# compositeImg
图片合成，编辑


# 合成图片
``` bash
var imgMergeN = new imgMerge({
    canvasEl: canvas,   // canvas
    cWidth:750,         // canvas的宽度
    cHeight:1208,       // canvas的高度
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
    allLoadEnd:function(){   
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
    data: [{ 
            val: './img/slide2.jpg',  // 图片地址   *必传
            zIndex: 1,  // 层级
            id: "bg"  // id 唯一值
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
    allLoadEnd:function(){   
        console.log("全部加载完成!");
    }
});
```


# api

