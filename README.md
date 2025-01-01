**补充tooltip超长省略提示功能，轻量便洁，同时支持vue与react**

- 现在大量项目都要求仅文本超长时，才出现提示，而现有的组件中，未提供该功能；
- 去除多余功能，只保留四个方向的单纯hover提示，轻量简洁；


**在线预览 [http://sichuan_meiyijia_industry_w327134.gitee.io/ellipsis/](http://sichuan_meiyijia_industry_w327134.gitee.io/ellipsis/)**

### 一、Vue集成方式

#### 1. 安装

```javascript
npm i simple-ellipsis -S
```

#### 2. /main.js/ts初始化

```javascript
import EllVue from 'simple-ellipsis/vue'
//内置深色与浅色两个风格，默认风格为element-dark，
//EllVue.thema = 'element-light'
app.use(EllVue)
```

#### 3.使用

在模板中通过指令v-ell，搭配下表中提供的参数使用

-   未添加参数或者参数使用错误会默认使用v-ell:t
-   在某些复杂场景下，可加上delay修饰,如v-ell.delay，ellipsis相关逻辑会延迟1秒执行，以避免异常

| 单行智能提示 | 总是提示(图标提示场景) | 多行智能提示   |
| ------------ | ---------------------- | -------------- |
| v-ell:t      | v-ell:t-a              | v-ell:t-[数字] |
| v-ell:b      | v-ell:b-a              | v-ell:b-[数字] |
| v-ell:l      | v-ell:l-a              | v-ell:l-[数字] |
| v-ell:r      | v-ell:r-a              | v-ell:r-[数字] |

**示例**
```html
<!--单行超长提示-->
<div v-ell>ellipsis在顶部提示</div>
<!--无论是否超长均顶部提示-->
<div v-ell:t-a>总是在顶部提示，提示内容为自身</div>
<!--多行超长提示，--ell-line指定行数-->
<div v-ell:t-3>ellipsis多行顶部提示,行数设置为3</div>
<!--自定义提示内容-->
<div v-ell:t-a="'自定义内容'">总是在顶部提示，提示内容为自定义内容</div>
```

### 二、React集成方式

#### 1. 安装

```javascript
npm i simple-ellipsis -S
```

#### 2. /main.js/ts初始化

```javascript
//默认为ant-design深色tooltip样式，仅在需要设置其他风格时，并执行下方语句，具体参考第三点中自定义tooltip样式
// document.documentElement.dataset.ellipsis = '自定义的主题名'
```

#### 3.使用

```javascript
// 在需要使用的地方导入组件EllReact
import EllReact  from 'simple-ellipsis/react'

//使用组件EllReact包裹需要提示的文本
<EllReact>
    <div>基本用法，需要智能判断是否超长便出现...省略提示的文本</div>
</EllReact>
```

EllReact支持以下属性

| 属性名 :类型 | 用途 | 可选值 |
| --- | --- | --- |
| placement :string | 设置tooltip方向 | top(默认值)、bottom、left、right |
| always :boolean | 为true时，不检测是否超长，常用于图标提示场景 | false(默认值)、true |
| line :number | 用于设置多行文提示 | 大于0的整数 |
| title ：string | 当属性always为true时，该属性生效，用于设置提示内容,未设置该值时，会取当前包裹元素的innerText | - |


### 三、自定义tooltip样式

目前只定义了element-dark、element-light、antd-dark三种风格，可在项目的全局样式文件中，复制粘贴下方的样式，修改对应的值，并按对应框架中，推荐的方式，设置主题。

1. 将该样式拷贝至全局css样式文件

```css
html[data-ellipsis='自定义的主题名'] {
    /*提示框最大宽度，超过后自动换行*/
    --ell-max-width: 350px;
    /*提示框背景色*/
    --ell-background: #fff;
    /*提示框字体大小*/
    --ell-font-size: 12px;
    /*提示框间距*/
    --ell-padding: 5px 11px;
    /*提示框行高*/
    --ell-line-height: 20px;
    /*提示框字体颜色*/
    --ell-color: rgb(48 49 51);
    /*提示框倒角*/
    --ell-border-radius: 4px;
    /*提示框边框颜色*/
    --ell-border-color: rgb(228 231 237);
    /*提示枉边框宽度*/
    --ell-border-size: 1px;
}
```

2. 设置主题

```js
// vue项目
EllVue.thema = '自定义的主题名'

//react项目
document.documentElement.dataset.ellipsis = '自定义的主题名'
```

### 四、注意事项
1. 包裹文本的元素需要为块级元素或者行内块，如当使用在span标签中使用，会不生效，此时要么将span标签改为div标签，要么使用css，将span标签的display改为block；
2. 同理，对于svg\img等特殊标签，应该外包一层同等大小宽度的div标签；
3. 提示框会自动判断提示内容是否超出可视区域，若超出可视区域，提示内容会出现在相反方向。即设置为top方向，但top方向无法显示全部的tooltip内容时，tooltip内容会自动出现在bottom方向；

### 五、有意思的发现
- element-ui中的el-tooltip组件默认的深色背景色为rgb(48 49 51)，没有透明度，仔细查看dom结构，将背景色改为有透明度的情况，会出bug，小三角和文本框重叠部分背景色会更深，哈哈。![alt text](image.png)
- ant design中的Tooltip组件默认的深色背景色为rgba(0, 0, 0, 0.75)，支持透明度，足见ant design在该组件上的设计确实要用心一些。

- 发现的契机在于本方案在配置ant design默认的tooltip样式时，也出现了同样的问题，尝试过使用clip-path裁剪掉多余部分，不过该方案存在缺馅，在某些情况下，会显示异常，三角形和文本框中会出现很细小的缝隙，故本方案也暂不支持设置透明度。
- 优化的思路仍是参照ant design采取的方案，故改动的地方会较多，等有时间再来优化。

