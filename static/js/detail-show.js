// Blog 主体的模板
var blogTextTemplate = function(blog) {
    var title = blog.title
    var author = blog.author
    var content = marked(blog.content)
    var d = new Date(blog.created_time * 1000)
    var time = d.toLocaleString()
    var t = `
      <div class='text-title'>${title}</div>
      <div class='text-content markdown-body'>
        ${content}
      </div>
      <div class='text-message'>
          <span class='text-author'>${author}</span>
          <span class='separator'>|</span>
          <i class='iconfont icon-shizhong'></i><time class='text-time'>${time}</time>
      </div>
    </div>
    `
    return t
}

// 添加 Blog 主体
var insertBlogTextAll = function(blogs, page) {
    console.log('insertBlogTextAll page', page)
    var html = ''
    var [k, v] = page.slice(0).split('-')
    console.log('insertBlogTextAll k v', k, v)
    for (var i = 0; i < blogs.length; i++) {
        var b = blogs[i]
        if(b.id == v) {
            var t = blogTextTemplate(b)
            html += t
            break
        }
    }
    // 把数据写入 .gua-blogs 中, 直接用覆盖式写入
    var div = document.querySelector('.blog-text')
    div.innerHTML = html
}

var blogTextAll = function(page) {
    var blogsArr = [{
        "title": "this",
        "author": "花",
        "content": "\n在 Javascript 中，函数的调用一共有 4 种方式：  \n\n**Function Invocation**  \n诸如`foo()`, 被调用的函数作为一个变量出现,在这种模式下，foo 函数体中的 this 永远为 Global 对象，在浏览器中就是 window 对象。 \n```\nvar x = 10;\nfunction foo(){\n    console.log(this); // window\n    console.log(this.x);   // 10\n}\nfoo();  \n```\n\n**Method Invocation Pattern** \n诸如`foo.bar()`, 被调用的函数作为一个对象的属性出现，在这种模式下，bar 函数体中的 this 永远为“.”或“[”前的那个对象，如上例中就一定是 foo 对象。\n```\nvar foo = {\n    x: 10,\n    bar: function () {\n        console.log(this);        // {x: 10, bar: ƒ}\n        console.log(this.x);      // 10\n    }\n};\nfoo.bar();\n```\n\n**Constructor Pattern**   \n诸如`new foo()` , 在这种模式下，foo函数内部的 this 永远是 `new foo()` 返回的对象。\n```\nfunction Foo(){\n    this.x = 10;\n    console.log(this);    //Foo {x:10}\n}\nvar foo = new Foo();\nconsole.log(foo.x);      //10\n```\n\n\n**Apply Pattern**  \n诸如`foo.call(thisObject)`和`foo.apply(thisObject)`，在这种模式下，`call`和`apply`的第一个参数就 是foo 函数体内的 this，如果 第一个参数 是`null`或`undefined`，那么会变成Global对象。\n\n```\nvar obj = {\n    x: 10\n}\nfunction foo(){\n    console.log(this);     //{x: 10}\n    console.log(this.x);   //10\n}\nfoo.call(obj);\nfoo.apply(obj);\nfoo.bind(obj)();\n```\n```\n(foo.bar)() // foo\n(foo.bar = foo.bar)() // Global\n(foo.bar || foo.bar)() // Global\n(foo.bar , foo.bar)() // Global\n```\n\n\n this是永远不会延作用域链或原型链出现一个 “查找” 的过程，只会在 **函数调用时** 就完全确认。\n \n > 所以严格说来没有看到调用，是不能确认 this 的指向的，你所下的关于 this 的推断，只是基于默认情况。 ",
        "created_time": 1520326265,
        "id": 1
    }, {
        "title": "面向对象",
        "author": "花",
        "content": "对象是什么?\n> 对象是一堆无序 key-value 组合的组成。  \n\n简单来说, key是属性，value是值.  \n\n其中 value 的值可以是什么呢?  \n可以是基本值，对象，或函数。  \n\n\n通常我们给简单对象添加方法如下两种:\n\n```\n// 可以这样\nvar person = {};\nperson.name = \"TOM\";\nperson.getName = function() {\n    return this.name;\n}\n\n// 也可以这样\nvar person = {\n    name: \"TOM\",\n    getName: function() {\n        return this.name;\n    }\n}\n```\n- 实际开发中可能还需要 Jack, Mike...等等无数的人头，那么就要创建 N 个简单对象, 这么做可想而知，非常没有效率.  \n\n于是就有了**工厂模式**:\n\n```\n// 工厂模式如下:\nvar createPerson = function(name, age) {\n\n    // 声明一个中间对象，该对象就是工厂模式的模子\n    var o = new Object();\n\n    // 依次添加我们需要的属性与方法\n    o.name = name;\n    o.age = age;\n    o.getName = function() {\n        return this.name;\n    }\n\n    return o;\n}\n\n// 创建两个实例\nvar perTom = createPerson('TOM', 20);\nvar PerJake = createPerson('Jake', 22);\n```\n\n> ECMAScript无法创建类，于是就有替代品：用函数封装以接口创建对象\n\n工厂模式帮助我们解决了重复代码上的麻烦,但也有缺陷:\n- 不能识别对象实例的类型 \n\n于是就有了**构造函数**:\n```\n// 构造函数如下:\nvar Person = function(name, age) {\n    this.name = name;\n    this.age = age;\n}\nvar person1 = new Person(\"Mike\", 29)\nvar person2 = new Person(\"Dick\", 25)\n```\n> Object 和 Array 是原生自定义构造函数。\n\n可以理解为：**返回一个对象的函数就是构造函数**\n\n其中 **new** 关键字做了什么呢?\n- 声明一个中间对象；\n- 将该中间对象的原型指向构造函数的原型；\n- 将构造函数的this，指向该中间对象；\n- 返回该中间对象，即返回实例对象。\n\n下面是模拟 new 的实现过程, 可以跳过不看.\n```\n// 模拟 new 做的事情如下:\n\n// 这是构造函数\nvar Person = function(name, age) {\n    this.name = name;\n    this.age = age;\n    this.getName = function() {\n        return this.name;\n    }\n}\n\n// 将构造函数以参数形式传入\nfunction New(func) {\n\n    // 声明一个中间对象，该对象为最终返回的实例\n    var res = {};\n    if (func.prototype !== null) {\n\n        // 将实例的原型指向构造函数的原型\n        // func 就是 Person 构造函数\n        res.__proto__ = func.prototype;\n    }\n\n    // ret为构造函数执行的结果，这里通过apply，将构造函数内部的this指向修改为指向res，即为实例对象\n    // Array.prototype.slice.call(arguments, 1) = ['tom', 20]\n    var ret = func.apply(res, Array.prototype.slice.call(arguments, 1));\n\n    // 当我们在构造函数中明确指定了返回对象时，那么new的执行结果就是该返回对象\n    if ((typeof ret === \"object\" || typeof ret === \"function\") && ret !== null) {\n        return ret;\n    }\n\n    // 如果没有明确指定返回对象，则默认返回res，这个res就是实例对象\n    return res;\n}\n\n// 通过new声明创建实例，这里的p1，实际接收的正是new中返回的res\nvar p1 = New(Person, 'tom', 20);\nconsole.log(p1.getName());\n\n// 当然，这里也可以判断出实例的类型了\nconsole.log(p1 instanceof Person); // true\n```\n\n构造函数解决了识别对象实例的类型,但也有缺陷:\n- 很多实例用的是同一个方法, 且这个方法实现的功能是一样的, 如上面的 getName, 那么一百个实例,就有一百个getName, 纯粹浪费空间. \n\n**那么能不能所有实例访问一个 getName ?**\n\n答案是有的.就是**原型**:\n- 每一个构造函数都有一个原型对象\n- 每一个 new 出来的实例，都有一个__proto__属性，该属性指向构造函数的原型对象.原型对象又指向构造函数.\n- 当所有的实例都能够通过__proto__访问到原型对象时，原型对象的方法与属性就变成了共有方法与属性。\n> constructor 就是原型对象指向构造函数的指针, 而__proto__是实例指向原型对象的指针\n\n所有的原生引用类型都是采用原型对象创建的：\n```\ntypeof Array.prototype.sort // \"function\"\ntypeof String.prototype.substring // \"function\"\n```\n**当我们访问实例对象中的属性或者方法时，会优先访问实例对象自身的属性和方法:**\n```\nfunction Person(name, age) {\n    this.name = name;\n    this.age = age;\n    this.getName = function() {\n        console.log('this is constructor.');\n    }\n}\n\nPerson.prototype.getName = function() {\n    return this.name;\n}\n\nvar p1 = new Person('tim', 10);\n\np1.getName(); // this is constructor. 原型中的访问并没有被访问\n```\n原型方法有两种写法:\n```\n1, Person.prototype.getName = function() {}\n// 字面量写法\n2, Person.prototype = {\n    constructor: Person,\n    getName: function() {},\n}\n```\n注意下字面量写法, Person.prototype = {} 实际上是重新创建了一个{}赋值给Person.prototype, 这里的{}并不是最初的那个原型对象。 因此它里面并不包含 constructor 属性,所以写的时候设置 constructor.\n\n\n### 属性类型\nECMAScript 有两种属性：数据属性和访问器属性  \n数据属性：\n - Configurable 能否删除属性\n - Enumerable 能否枚举,通过 for in 返回属性\n - Writable 能否修改属性的值\n - Value 属性的具体值, 操作属性时从这里读/写  \n\n访问器属性：  \n - Configurable 能否删除属性\n - Enumerable 能否枚举,通过 for in 返回属性\n - Get 读取属性时调用\n - Set 写入属性时调用  \n\n我们可以通过Object.defineProperty 来修改这些属性，设置多个属性用Object.defineProperties，不做演示了.\n\n\n> 检查 \nperson1.constructor(构造函数属性) == Person // true\nperson1.constructor(构造函数属性) == Person // true\n\n> person1.hasOwnProperty('name')  \n.hasOwnProperty 可以知道该属性是否在实例中，在实例中为 true \n\n> for-in循环返回的既包括原型，也包括实例\n\n",
        "created_time": 1520338835,
        "id": 2
    }, {
        "title": "viewport",
        "author": "花",
        "content": "### 三个概念：\n1. **px(CSS pixels)**\n虚拟像素\n2. **dp(device pixels)**\n设备像素（物理像素）\n3. **dpr(device pixels ratio)**\n设备像素比\n\n#### 三个概念的关系：  \n**公式为1px = (dpr)^2 * 1dp**\n\n如果 dpr = 2   \n那么 1px 由 4个物理像素显示.  \n如果 dpr =1    \n那么 1px 由 1个物理像素显示.\n\n\n#### 举个生活中的例子：\niphone5\n4.0 英寸(屏幕主对角线的尺寸)\n1136 * 640 dp(物理像素)  \n326 ppi(1英寸多少像素)\n\n#### 这例子中 三者的关系是：\n√(1136^2 + 640^2) / 4 =326 ppi\n- √(1136^2 + 640^2) = 斜边尺寸\n- 斜边尺寸 / 4.0英寸 = 326 ppi\n\n##### 手机这个例子和三个概念有什么关系？\n通过表格可以查找到 ppi 对应的 dpr  \n\n查找套路：\n- 我要找的手机是 iphone5\n- iphone5 的 ppi 是 326 ppi\n- 326 ppi 对应的 dpr(默认缩放比)是 2\n- 根据 1px = （**2**^2）* 1dp：\n```\n其虚拟像素为 \n1136/2 = 568px;\n640/2 = 320px;\n320px * 568px = 1136 * 640dp\n```\n\nviewport \n根据上述推导，我们也知道了 iphone 6 的虚拟像素是：  \n**360 * 660px**\n\n但 360 * 660px 的元素放在 iphone 6上是 **不能全屏的**，为什么？\n\n原因在 viewport 的原理：\n1. 先将页面渲染在一个 width 为显示设备默认尺寸的viewport上，如肾6Plus为980px；\n\n2. 然后将viewport等比例缩放至整个手机屏幕上；\n\n关于viewport，涉及两个概念：\n\n- layout viewport：布局viewport，可以理解为放置页面的幕布\n\n- visual vewport：视窗viewport，可以理解为屏幕的视窗  \n\n具体到例子中就是：  \n肾6Plus的visual viewport的宽度为360px，layout viewport为980px；\n\n扯了这么多，怎么办？\n**改变 viewport 的 layout viewport**\n```\n<meta name=\"viewport\" content=\"width=360\">\n```\n当然了，理论上是上述这样，实操中我们直接就让 layout viewport 总是等于设备宽度：\n```\n<meta name=\"viewport\" content=\"width=device-width\">\n\n```\n",
        "created_time": 1520338908,
        "id": 3
    },{
        "title": "闭包",
        "author": "花",
        "content": "MDN 的定义：  \r\n\r\n> 闭包是指那些能够访问自由变量的函数。换句话说，这些函数可以“记住”它被创建时候的环境。\r\n\r\n闭包 = 能够访问自由变量的函数\r\n\r\n那么自由变量是什么？\r\n> 自由变量是指在函数中使用的，但既不是函数参数也不是函数的局部变量的变量。\r\n\r\n由此可见 \r\n闭包 是由 **函数** 和 **函数能够访问的自由变量** 两部分组成。\r\n```\r\nvar a = 1;\r\n\r\nfunction foo() {\r\n    console.log(a);\r\n}\r\n\r\nfoo();\r\n// 变量 a 不是 foo 函数的参数\r\n// 变量 a 不是 foo 函数的局部变量\r\n// 函数 foo() 和 函数能够访问的自由变量 a 构成了闭包\r\n```\r\n\r\n\r\n用执行上下文来理解就是：  \r\n**执行上下文(代号A)，以及在该执行上下文中创建的函数（代号B），\r\n当B执行时，如果访问了A中变量对象中的值，那么闭包就会产生。**\r\n\r\n理论角度就是如此，但更多人从实际运用的角度来理解闭包：  \r\n- 即使创建自由变量的执行上下文已经执行完毕，但它仍然被保存在内存中，可被访问。（比如，内部函数从父函数中返回）\r\n\r\n```\r\nvar scope = \"global scope\";\r\nfunction checkscope(){\r\n    var scope = \"local scope\";\r\n    function f(){\r\n        return scope;\r\n    }\r\n    return f;\r\n}\r\n\r\ncheckscope()();\r\n```\r\n\r\n1. 创建全局执行上下文放入栈中\r\n2. 执行 checkscope,创建 checkscope 执行上下文，放入栈中\r\n3. `return f`，checkscope 执行完毕，**弹出栈**\r\n4. 执行 f,创建 f 执行上下文，放入栈中\r\n5. `return scope`，f 执行完毕，弹出栈\r\n\r\n当 f 函数执行的时候，checkscope 函数上下文已经被销毁(加粗部分)，那么怎么读取到 scope 的？  \r\n\r\n这时引入作用域链概念：\r\n```\r\n// f 的作用域链\r\nfContext = {\r\n    Scope: [AO, checkscopeContext.AO, globalContext.VO],\r\n}\r\n//f 执行上下文创建了 活动对象 AO 被置于作用域链的最前端。\r\n```\r\n了解作用域链就知道，寻找标识符是沿着作用域链一直查找，f 活动对象中自然是没有，那么到 checkscope 的变量对象中查找，找到了 `var scope = \"local scope\"` 。\r\n\r\n> 这就是为什么说 **闭包会把整个变量对象保存在内存中** 的原因,换句话说，**这些函数可以“记住”它被创建时候的环境。**\r\n\r\n\r\n```\r\nvar data = [];\r\n\r\nfor (var i = 0; i < 3; i++) {\r\n  data[i] = function () {\r\n    console.log(i);\r\n  };\r\n}\r\n\r\ndata[0]();\r\ndata[1]();\r\ndata[2]();\r\n```\r\n结果都是 3\r\n\r\n当执行 data[0] 函数的时候，data[0] 函数的作用域链为：\r\n```\r\ndata[0]Context = {\r\n    Scope: [AO, globalContext.VO]\r\n}\r\n```\r\ndata[0]Context 的 AO 并没有 i 值，所以会从 globalContext.VO 中查找，i 为 3.\r\n> 当执行到data[0]函数的时候，for循环 已经执行完了，i是全局变量，此时的值为3\r\n\r\n```\r\nvar data = [];\r\n\r\nfor (var i = 0; i < 3; i++) {\r\n  data[i] = (function (i) {\r\n        return function(){\r\n            console.log(i);\r\n        }\r\n  })(i);\r\n}\r\n\r\ndata[0]();\r\ndata[1]();\r\ndata[2]();\r\n```\r\n当执行 data[0] 函数的时候，data[0] 函数的作用域链为：\r\n\r\n```\r\ndata[0]Context = {\r\n    Scope: [AO, 匿名函数Context.AO globalContext.VO]\r\n}\r\n```\r\n\r\n在匿名函数变量对象中找到 i，也就不会去全局变量对象去找了。\r\n\r\n\r\n用 let 也可以解决，因为 let 会创建新的作用域：\r\n```\r\nvar data = [];\r\nfor (let i = 0; i < 3; i++) {\r\n  data[i] = function () {\r\n    console.log(i);\r\n  };\r\n}\r\n\r\ndata[0]();\r\ndata[1]();\r\ndata[2]();\r\n```\r\n\r\n\r\n#### 各种闭包的实现：\r\n最常见的闭包实现：\r\n```\r\nvar fn = null;\r\nfunction foo() {\r\n    var a = 2;\r\n    function innnerFoo() {\r\n        console.log(a);\r\n    }\r\n    fn = innnerFoo; // 将 innnerFoo的引用，赋值给全局变量中的fn\r\n}\r\n\r\nfunction bar() {\r\n    fn(); // 此处的保留的innerFoo的引用\r\n}\r\n\r\nfoo();\r\nbar(); // 2\r\n```\r\n通过闭包在外部作用域下操纵私有变量 (1)：\r\n```\r\nfunction iCantThinkOfAName(num, obj) { \r\n  //array变量和两个函数参数，被嵌套函数doSomething捕获\r\n  var array = [1, 2, 3];\r\n  function doSomething(i) {\r\n    num += i;\r\n    array.push(num);\r\n    console.log('num: ' + num);\r\n    console.log('array: ' + array);\r\n    console.log('obj.value: ' + obj.value);\r\n  }\r\n\r\n  return doSomething;\r\n}\r\n\r\nvar referenceObject = { value: 10 };\r\nvar foo = iCantThinkOfAName(2, referenceObject); // 闭包 #1\r\nvar bar = iCantThinkOfAName(6, referenceObject); // 闭包 #2\r\n\r\nfoo(2);\r\n```\r\n通过闭包外部作用域下操纵私有变量 (2)：\r\n```\r\nfunction mysteriousCalculator(a, b) {\r\n    var mysteriousVariable = 3;\r\n    return {\r\n        add: function() {\r\n            var result = a + b + mysteriousVariable;\r\n            return toFixedTwoPlaces(result);\r\n        },\r\n\r\n        subtract: function() {\r\n            var result = a - b - mysteriousVariable;\r\n            return toFixedTwoPlaces(result);\r\n        }\r\n    }\r\n}\r\n\r\nfunction toFixedTwoPlaces(value) {\r\n    return value.toFixed(2);\r\n}\r\n\r\nvar myCalculator = mysteriousCalculator(10.01, 2.01);\r\nmyCalculator.add() // 15.02\r\nmyCalculator.subtract() // 5.00\r\n```\r\n通过闭包在外部作用域下操纵私有变量 (3)：\r\n```\r\nfunction secretPassword() {\r\n  var password = 'xh38sk';\r\n  return {\r\n    guessPassword: function(guess) {\r\n      if (guess === password) {\r\n        return true;\r\n      } else {\r\n        return false;\r\n      }\r\n    }\r\n  }\r\n}\r\n\r\nvar passwordGame = secretPassword();\r\npasswordGame.guessPassword('heyisthisit?'); // false\r\npasswordGame.guessPassword('xh38sk'); // true\r\n```\r\n\r\n\r\n\r\n模块模式，是为单例，\r\n\r\n模块模式 (1)：\r\n```\r\nvar singleton = function() {\r\n    // 私有变量和私有函数\r\n    var privateVariable = 10;\r\n    function privateFunction() {\r\n        return false\r\n    }\r\n    // 特权/公有方法和属性\r\n    return {\r\n      publicProperty: true,\r\n      publicMethod:   function() {\r\n          privateVariable++       \r\n          return console.log(privateVariable)\r\n      }\r\n    }\r\n}\r\n\r\nvar single = singleton()\r\nsingle.publicMethod()\r\n```\r\n\r\n```\r\nvar BaseComponent = {};\r\n\r\nvar application = function () {\r\n    //私有变量和函数\r\n    var components = new Array();\r\n\r\n    //初始化\r\n    components.push(new BaseComponent());\r\n\r\n    //公共\r\n    return {\r\n        getComponentCount: function () {//返回已注册的组件数\r\n            return components.length;\r\n        },\r\n        registerComponent: function (component) {//注册新组件\r\n            if (typeof component == \"object\") {\r\n                components.push(component);\r\n            }\r\n        }\r\n    };\r\n}();\r\n```\r\n\r\n模块模式 (2)：\r\n\r\n```\r\nvar application = function() {\r\n    var components = new Array()\r\n    components.push(new BaseComponent())\r\n    return {\r\n      getComponentCount: function(){\r\n          return components.length;\r\n      },\r\n      registerComponent: function(components){\r\n          if (typeof component == \"object\"){\r\n              components.push(component)\r\n          }\r\n      }\r\n    }\r\n}\r\n```\r\n\r\n```",
        "created_time": 1520339716,
        "id": 5
    }, {
        "title": "作用域链",
        "author": "花",
        "content": "作用域链决定了哪些数据能够**被当前函数访问**以及**访问的顺序**；  \n\n作用域链，是由**当前环境与上层环境的一系列变量对象**组成\n\n执行上下文会创建变量对象，创建作用域链和指定this.其中创建作用域链是怎么做的呢？\n\n函数创建时，会创建一个包含 Global Object 的作用域链，这个作用域链储存在内部[[Scope]]属性中。函数执行的时候会创建一个执行环境，通过复制[[Scope]]属性中的对象，构建该执行环境的作用域链，并把自己的活动对象推入该作用域链的前端以此形成完整的作用域链。\n\n也就是说，当前执行上下文的活动对象永远在作用域的最前端，全局变量永远存在于当前执行上下文作用域链的最末端。\n\n示例：\n```\nvar a = 20;\n\nfunction test() {\n    var b = a + 10;\n\n    function innerTest() {\n        var c = 10;\n        return b + c;\n    }\n\n    return innerTest();\n}\n\ntest();\n```\ninnerTest 执行上下文：\n```\ninnerTestEC = {\n    VO: {...},  // 变量对象\n    scopeChain: [VO(innerTest), VO(test), VO(global)], // 作用域链\n}\n```\n\n我们可以在作用域链这个单向通道中，查询变量对象中的标识符，这样就可以访问到上一层作用域中的变量了。\n\n> 标识符：变量名或者函数名",
        "created_time": 1520339741,
        "id": 6
    }, {
        "title": "执行上下文 和 变量对象",
        "author": "花",
        "content": "执行上下文是一个抽象的概念。\n```\nconsole.log('EC0');\nfunction funcEC1(){\n    console.log('EC1');\n    function funcEC2(){\n        console.log('EC2');\n        var funcEC3 = function(){\n            console.log('EC3');\n        };\n    }\n    funcEC2();\n}\nfuncEC1();\n```\njavascript 引擎在解析上述代码时，依次添加到函数调用栈中。如下图：\n\n|EC3|\n|:-:|\n|EC2|\n|EC1|\n|EC0(Global)|\n\n栈底永远是全局执行环境，栈顶永远是当前执行环境。每执行完一个上下文，就回收该执行上下文。  \n\n执行上下文分为两个阶段，创建阶段和执行阶段  \n\n创建阶段包括：  \n创建变量对象  \n作用域链  \n指定 this\n\n执行阶段：  \n活动对象\n\n\n### 变量对象  \n执行上下文的数据是以变量对象的属性形式进行存储的.\n，变量对象里包括：\n- 函数的所有形参 (如果是函数上下文)\n\n由名称和对应值组成的一个变量对象的属性被创建\n没有实参，属性值设为 undefined\n- 函数声明\n\n由名称和对应值（函数对象(function-object)）组成一个变量对象的属性被创建\n如果变量对象已经存在相同名称的属性，则完全替换这个属性\n- 变量声明\n\n由名称和对应值（undefined）组成一个变量对象的属性被创建；\n如果变量名称跟已经声明的形式参数或函数相同，则变量声明不会干扰已经存在的这类属性\n> 没有通过 var 关键字声明，不会被存放在 AO 中。\n\n举个例子，如下代码：\n```\nvar a = 10;\nfunction test(x){\n    var b = 20;\n}\ntest(30);\n```\nJavascript 引擎会将其解析为：\n```\n// 全局执行上下文的变量对象：\nVO(globalContext) = {\n    a: 10,\n    test: <ref to function>\n};\n// test 函数执行上下文的变量对象：\nVO(test functionContext) = {\n    x:30,   // 形参 x，其实形参就是被赋值的变量。\n    b:20\n};\n```\n\n\n当前被调用的执行上下文，也就是在某个执行上下文的执行阶段，其变量对象会转为活动对象。  \n\n活动对象中多个 arguments 的变量挂在 活动对象 上。\n```\narguments = {\n    callee,\n    length,\n    properties-indexes\n};\n```\n\n其中变量对象的创建经历了什么过程，如果你有了解过声明提升就懂了，这个过程就是声明提升.  \n1.变量声明和函数声明全部前置。  \n2.变量声明前置时，如有同名则忽略。  \n3.函数声明前置时，如有同名则覆盖。  \n\n> 函数参数未传入则为 undefined",
        "created_time": 1520339880,
        "id": 7
    }, {
        "title": "继承",
        "author": "花",
        "content": "继承分为构造函数的继承和原型的继承。  \n\n下面来看看几种继承方式：\n```\nfunction Parent(name) { \n    this.name = name;\n}\nParent.prototype.sayName = function() {\n    console.log('parent name:', this.name);\n}\nfunction Child(name) {\n    this.name = name;\n}\n\nChild.prototype = new Parent('father');\nChild.prototype.constructor = Child;\n\nvar child = new Child('son');\nchild.sayName();    // child name: son\n```\n缺陷：\n- 子类型无法给超类型传递参数，对构造函数的继承不够灵活。\n> 简单来说，我们希望通过  \n**var child = new Child('son', 'father')**\n让子类去调用父类的构造器来完成继承。\n而不是通过 new Parent('father') 去调用父类\n\n类式继承：\n```\nfunction Parent(name) { \n    this.name = name;\n}\nParent.prototype.sayName = function() {\n    console.log('parent name:', this.name);\n}\nParent.prototype.doSomthing = function() {\n    console.log('parent do something!');\n}\nfunction Child(parentName) {\n    Parent.call(this, parentName);\n}\n\nChild.prototype.sayName = function() {\n    console.log('child name:', this.name);\n}\n\nvar child = new Child('son');\nchild.sayName();      // child name: son\nchild.doSomthing();   // TypeError: child.doSomthing is not a function\n\n```\n缺陷：\n- 只继承了构造函数，但没有原型。无法复用一些公用函数。\n\n组合式继承：\n```\nfunction Parent(name) { \n    this.name = name;\n}\n\nParent.prototype.sayName = function() {\n    console.log('parent name:', this.name);\n}\nParent.prototype.doSomething = function() {\n    console.log('parent do something!');\n}\n\n// 继承构造函数 二次调用\nfunction Child(parentName) {\n    Parent.call(this, parentName);\n}\n\n// 继承原型 一次调用\nChild.prototype = new Parent();      \nChild.prototype.constructor = Child;\n\nvar child = new Child('son');\nchild.sayName();       // child name: son\nchild.doSomething();   // parent do something!\n```\n缺陷：\n- 虽说继承了构造函数和原型两者，但冗余，继承原型那次同时也继承了构造函数，浪费。\n> 你可能会想到这种写法：Child.prototype = Parent.prototype;但这样写有问题：\n- 子类父类指向同一个对象，添加方法给子类的同时会强行给父类添加方法，重写方法也会影响父类。\n\n寄生组合式继承：\n```\nfunction Parent(name) {\n    this.name = name;\n}\nParent.prototype.sayName = function() {\n    console.log('parent name:', this.name);\n}\n\nfunction Child(name, parentName) {\n    Parent.call(this, parentName);  \n    this.name = name;    \n}\n\n// 把空构造函数的 prototype 指向父元素\nfunction create(proto) {\n    function F(){}\n    F.prototype = proto;\n    return new F();\n}\n\n// create 函数用来创建新构造函数，并绑定父类的原型，然后返回。\nChild.prototype = create(Parent.prototype);\nChild.prototype.sayName = function() {\n    console.log('child name:', this.name);\n}\nChild.prototype.constructor = Child;\n\nvar parent = new Parent('father');\nparent.sayName();    // parent name: father\n\nvar child = new Child('son', 'father');\nchild.sayName();     // child name: son\n```\n特点：  \n利用一个中间函数,切断子类对父类的影响。可以这样理解：  \n子类这边的“父类原型方法”来自于“中间函数”，子类的改动影响不了父类。而父类的改动却可以由“中间函数”得到继承。  \n\n不过，在ECMAScript5中直接提供了一个Object.create方法来完成我们上面自己封装的create的功能，实现如下：  \n```\nfunction Parent(name) {\n    this.name = name;\n}\nParent.prototype.sayName = function() {\n    console.log('parent name:', this.name);\n}\n\nfunction Child(name, parentName) {\n    Parent.call(this, parentName);  \n    this.name = name;    \n}\n\nfunction inheritPrototype(Parent, Child) {\n    Child.prototype = Object.create(Parent.prototype);   //修改\n    Child.prototype.constructor = Child;\n}\n\ninheritPrototype(Parent, Child);\n\nChild.prototype.sayName = function() {\n    console.log('child name:', this.name);\n}\n\nvar parent = new Parent('father');\nparent.sayName();      // parent name: father\n\nvar child = new Child('son', 'father');\nchild.sayName();       // child name: son\n```\n在 ES6 中还可以这样写：\n```\nclass Parent {\n    constructor(name) {\n\tthis.name = name;\n    }\n    doSomething() {\n\tconsole.log('parent do something!');\n    }\n    sayName() {\n\tconsole.log('parent name:', this.name);\n    }\n}\n\nclass Child extends Parent {\n    constructor(name, parentName) {\n\tsuper(parentName);\n\tthis.name = name;\n    }\n    sayName() {\n \tconsole.log('child name:', this.name);\n    }\n}\n\nconst child = new Child('son', 'father');\nchild.sayName();            // child name: son\nchild.doSomething();        // parent do something!\n\nconst parent = new Parent('father');\nparent.sayName();           // parent name: father\n```\n\n继承后, 搜索属性和方法会沿着继承的原型链一直往上找：  \n\n**实例-原型-父类实例-父类原型...**\n\n在js里，所有的引用类型都默认继承 Object, 所有函数都是 Object 的实例，**也就是说原型链的最顶端有个 Object** ,因此默认原型包含一个内部指针，指向Object.prototype.  \n\n**这就是为何所有自定义类型都会继承 toString(),valueOf() 等默认方法的原因。**\n\n",
        "created_time": 1520339967,
        "id": 8
    }, {
        "title": "Date()",
        "author": "花",
        "content": "Date类型使用自UTC（Coordinated Universal Time，国际协调时间）1970 年1 月1 日午夜（零时）开始经过的毫秒数来保存日期。在使用这种数据存储格式的条件下，Date 类型保存的日期能够精确到1970 年1月1 日之前或之后的285 616 年。\r\n\r\n\r\n创建 date()对象 \r\n\r\n```\r\nvar date = new Date();\r\n```\r\n\r\nnew Date()不传参数默认是当前时间，如果需要指定时间，那么就要传参数，参数是毫秒数，但这样太繁琐，于是ECMAScript提供了两个方法：**Date.parse()** 和 **Date.UTC()**\r\n- Date.parse()基于GMT，Date.UTC()基于UTC\r\n- 参数格式有区别，看个例子就懂。\r\n\r\n```\r\n// 这是 Date.parse() 用法\r\nvar date = new Date(Date.parse('Wed Nov 18 2015 17:06:21 GMT+0800')); // 传入的是中国区域日期字符串格式\r\nvar date = new Date('Wed Nov 18 2015 17:06:21 GMT+0800'); // 这种方式也是正确的，解析器会自动进行转换\r\n\r\n// 严格来说，参数格式因地区而异.\r\n```\r\n\r\n```\r\n// 这是 Date.UTC() 用法\r\n\r\n// GMT 时间2000 年1 月1 日午夜零时\r\nvar y2k = new Date(Date.UTC(2000, 0));\r\nvar y2k1 = new Date(2000, 0);\r\n\r\n// GMT 时间2005 年5 月5 日下午5:55:55\r\nvar allFives = new Date(Date.UTC(2005, 4, 5, 17, 55, 55));\r\nvar allFives = new Date(2005, 4, 5, 17, 55, 55);\r\n\r\n// 只有前两个参数（年和月）是必需的。如果没有提供月中的天数，则假设天数为1\r\n\r\n```\r\n与其他引用类型一样，Date 类型也重写了 toLocaleString()、toString() 和 valueOf() 等方法:\r\n```\r\n// 创建 date()对象  \r\nvar date = new Date()\r\n\r\ndate \r\n// Fri Jan 26 2018 18:22:07 GMT+0800 (中国标准时间)\r\ndate.toDateString()\r\n// \"Fri Jan 26 2018\"\r\ndate.toTimeString()\r\n// \"18:22:07 GMT+0800 (中国标准时间)\"\r\ndate.toLocaleDateString()\r\n// \"2018/1/26\"\r\ndate.toLocaleTimeString()\r\n// \"下午6:22:07\"\r\ndate.toUTCString()\r\n// \"Fri, 26 Jan 2018 10:22:07 GMT\"\r\ndate.toLocaleString()\r\n// \"2018/1/26 下午6:22:07\"\r\ndate.toString()\r\n// \"Fri Jan 26 2018 18:22:07 GMT+0800 (中国标准时间)\"\r\ndate.valueOf()\r\n// 1516962127552\r\n```\r\n```",
        "created_time": 1520340118,
        "id": 9
    }, {
        "title": "跨域",
        "author": "花",
        "content": "### 跨域是什么？\r\n1. js 里发送 ajax 请求，如果请求的 url 和当前页面的 url 非同域，则浏览器拒绝提供接受的数据并报错;\r\n2. 当前页面下引入iframe，如果 iframe 里的页面和当前页面的 url 非同域， 则浏览器禁止当前页面的 js 获取或者操作 iframe下页面的 DOM\r\n\r\n上面两种场景就是跨域，概念上就是：\r\n只要协议、域名、端口有任何一个不同，都被当作是不同的域，之间的请求就是跨域操作。\r\n\r\n**同域又是什么呢？**\r\n\r\n同域是指：\r\n1. 同协议\r\n2. 同域名\r\n3. 同端口\r\n\r\n### 为什么会有跨域限制？\r\n简单的说，禁止跨域就是为了保证：网页不会被别的网页的JS篡改，或者伪造，网页的AJAX的地址不会被别人滥用等等。\r\n\r\n### 跨域怎么解决?\r\n对于禁止访问的场景1，有两种方法能绕过浏览器的限制，一种是 JSONP，另外一种是 CORS\r\n\r\n**JSONP:**\r\n就是利用`<script>`标签没有跨域限制的“漏洞”来达到与第三方通讯的目的\r\n例如创建如下 `script`：\r\n```\r\n<script src=\"http://www.example.net/api?param1=1&param2=2?callback=showData\"></script>\r\n```\r\n后端会去解析callback这个参数获取到字符串 showData，返回数据：\r\n```\r\nshowData({\"city\": \"hangzhou\", \"weather\": \"晴天\"})\r\n```\r\n\r\n> JSONP 需要对应接口的后端的配合才能实现。\r\n  \r\n\r\n**CORS：**\r\n\r\n当你发送请求时，浏览器发现该请求不符合同源策略，会给该请求加一个请求头：**Origin**，后台进行一系列处理，如果确定接受请求则在返回结果中加入一个响应头：**Access-Control-Allow-Origin**; 浏览器判断该相应头中**是否包含 Origin 的值**，如果有则浏览器会处理响应，我们就可以拿到响应数据，如果不包含浏览器直接驳回，这时我们无法拿到响应数据。\r\n\r\nAccess-Control-Allow-Origin:*\r\n设为星号也就等于告诉浏览器，我的这个URL的资源是允许任何来源的请求访问我的\r\n\r\n\r\n",
        "created_time": 1520433991,
        "id": 10
    }, {
        "title": "HTTP 协议是什么？",
        "author": "花",
        "content": "### HTTP 协议是什么？\r\n\r\n一个传输协议，协议就是双方都遵守的规范。\r\n和现实生活中的“协议”意思近似，是一种列成条文的约束。它约束我们做什么，和不做什么。而在网络中，就是约束服务器和客户端对数据该怎么处理。\r\n\r\n### HTTP 报文:\r\n1. 起始行 \r\n- 请求报文里是请求方法 请求路径 协议版本\r\n- 响应报文里是版本号 状态码 状态码描述\r\n2. 首部\r\n3. 主体\r\n\r\n\r\n### 请求方法：\r\n\r\nGET: 请求服务器发送某个资源.\r\n平时浏览网页输入网址时，就是给服务器发送了 GET 请求  \r\nHEAD: 和 GET 相似，但只响应资源基本信息，而不响应资源.   \r\nPUT: 向服务器写入资源.\r\nPOST：向服务器发送数据.\r\n\r\nAccept:能够处理的媒体类型及媒体类型的相对优先级。q 0~1 权重值  \r\nAccept-Charset: 能够处理的字符集及字符集的相对优先级\r\nAccept-Encoding:接受的压缩方式  \r\nAccept-Language: 接受的语言  \r\nUser-Agent: 当前浏览器的相关信息  \r\n\r\nhttpOnly: 不允许 js 操作 cookie\r\nsecure:为 true 时，cookie 在 HTTP 中无效，在 HTTPS 中有效\r\n\r\n### 缓存:\r\n假设服务器和客户端交互过程如下：\r\n\r\n**客户端-代理1-代理2-服务器**\r\n\r\n**Cache-Control**\r\npublic 可被任何中间节点缓存, 比如上例中的2个代理都可以缓存，下次请求同一资源可以从代理那拿到缓存。\r\nprivate  中间节点不允许缓存\r\nmax-age 有效时间，单位为秒。该时间内请求统一资源会调用缓存\r\nno-store 不缓存\r\nno-cache 不使用 Cache-control 的缓存控制方式做验证。而使用 Etag 或 Last-modified 等其他方法\r\n\r\n**Etag 又是什么？**\r\n\r\nEtag 是对文件的编码\r\n假设 max-age=300, 300秒之内自然是读缓存，那么300秒之后在向服务器发送请求时，附带 Etag，和后端文件重新计算的 Etag 作比较，后端文件变了，Etag就改变，那么自然就要重新获取文件和新 Etag 了。 如果没变，那就说明后端文件没变，那么则返回一个只有头部短消息，状态码 304.\r\n\r\n> 300秒之后向服务器发送请求时，附带 Etag 的 头部是：If-None-Match\r\n\r\n**与 Etag 类似的还有 Last-Modified/if-Mondified-Since:**\r\n\r\n一样是在超过 Etag 的有效时间后，发现资源有 Last-Modified 声明，那么发送请求头部带上 if-Mondified-Since 表示请求时间，后端接受后与同一资源的最后修改时间做对比，最后修改时间较新，则有变化，较旧则无修改，那么则响应状态码 304",
        "created_time": 1520434030,
        "id": 11
    }]
    insertBlogTextAll(blogsArr, page)
}

var commentsTemplate = function(com) {
    var author = com.author
    var content = com.content
    var d = new Date(com.created_time * 1000)
    var time = d.toLocaleString()
    var t = `
      <div class="blog-comments-cell">
          <div class="comments-cell-comment">${content}</div>
          <div class="">
              <span>${author}</span> @ <time>${time}</time>
          </div>
      </div>
    `
    return t
}

var insertCommentAll = function(comments) {
    var html = ''
    for (var i = 0; i < comments.length; i++) {
        var c = comments[i]
        // 取当前页面发表评论按钮上的 blog id
        var comBlogId = document.querySelector('.comment-blog-id').value
        console.log('comBlogId启动', comBlogId)
        if(c.blog_id == comBlogId){
          var t = commentsTemplate(c)
          html += t
          break
        }
    }
    // console.log('insertCommentAll启动', html)
    var blogCommentsDiv = document.querySelector('.blog-comments')
    blogCommentsDiv.insertAdjacentHTML('beforeend', html)
}

var commentAll = function() {
    var request = {
        method: 'GET',
        url: '/api/comment/all',
        contentType: 'application/json',
        callback: function(response) {
            // 不考虑错误情况(断网/服务器返回错误等等)
            console.log('响应', response)
            var comments = JSON.parse(response)
            insertCommentAll(comments)
        }
    }
    ajax(request)
}

var commentNew = function(form) {
    var data = JSON.stringify(form)
    var request = {
        method: 'POST',
        url: '/api/comment/add',
        data: data,
        contentType: 'application/json',
        callback: function(response) {
            console.log('响应', response)
            var res = JSON.parse(response)
        }
    }
    ajax(request)
}

// 添加博客详情的 html
var insertBlogDetail = function(blogId) {
    var [k, blogid] = blogId.slice(0).split('-')
    console.log('insertBlogDetail page', blogid)
    var t = `
        <div class='blog-detail-container'>
            <div class="blog-detail-background"></div>
            <div class="blog-text"></div>
                <div class="blog-comments-container">
                    <div class='blog-comments-add'>
                        <h2>LEAVE A COMMENT</h2>
                        <input class='comment-blog-id' type=hidden value="${blogid}">
                        <input class='comment-author' placeholder="Your name...">
                        <textarea class='comment-content' placeholder="Message..."></textarea>
                        <button class='comment-add'>发表评论</button>
                    </div>
                    <div class='blog-comments'>
                        <h2>COMMENTS</h2>
                    </div>
                </div>
        </div>
    `
    var pageDiv = document.querySelector('.blog-pages-container')
    // 在容器中添加 详情
    pageDiv.innerHTML = t
}
