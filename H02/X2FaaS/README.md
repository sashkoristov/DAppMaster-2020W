<h1 align="center">X2FaaS</h2>
<!-- <h2 align="center">Dependency-aware FaaSifier</h2> -->

X2FaaS lets you outsource parts of a NodeJS app to FaaS (Amazon, Google & IBM)

In addition to existing tools, it supports:

* Dependencies ([`install`](#install))
* Importing other files and functions ([`require`](#require))
* Global variables ([`vars`](#vars)) 


## Install

```shell
npm i -g x2faas # install globally
```
 
 
## Usage

### 1. Add annotations in your Monolith code:

```js
// l     
var a = 1;
// lend 
```

The enclosed code will be packaged into a FaaS function.

### 2. Run X2FaaS via Editor Extension:
Coming soon
    
### 2. Run X2FaaS via CLI (Alternative, not recommended):

```shell
$ x2faas OPTIONS... 
```
Options: 

* `--fpath PATH`: The path to the `.js` file in which you want to faasify code
* `--linenum NUM`: The line number of the `// l ...` Annotation (**starts at 0**)
* `--outpath PATH`: The path where the FaaS function folder should be put`)
* `--provider amazon | google | ibm` Which FaaS provider to outsource to
* [`--commentout`]: If specified, the faasified section will be replaced with an FaaS API call. Only works if you specified [`//l name(...)`](#name)!


### 3. Output

The tool creates an equivalent FaaS function of that section in `[--outpath]/['--provider']/[name]`:


```
└── amazon
    └── 28723n2398jfs9f87239uhfe9
        ├── index.js
        └── package.json 

└── google
    └── s940928n38902h2938h293t82
        ├── index.js
        └── package.json 
```

You can deploy these folders directly to the respective FaaS platform.
One file can have multiple `// l` ... `// lend` sections, that can be converted separately.


## Annotation syntax

`//l` can be followed by any combination of these space-separated directives.

### `name()`

You can give your FaaS function a name to better keep track of it:

```js
// l name(myfn)
 var a = 1
// lend
```

```
└── amazon | google | ibm
    └── myfn
       └── ....
    
```



### `vars()`

Your code might rely on global variables. You can capture them using `vars()`:

```js
var a = 1
// l vars(a)
a++
// lend
```

They will be unwrapped from `event`and added to the scope inside the FaaS function.


### `require`

Your code might rely on functions from other files. You can declare that using `require()`:

```js
// l require(./foo.js as foo)
foo()
// lend
```

A portable version of `foo.js` is then included in the deployment package, and the line `const foo = require('./foo.js')` is added.

```
└── amazon | google | ibm
    └── myfunc
       └── foo.js  // <---
       └── ...
```

If `foo` in turn depends on other functions or dependencies, they are bundled as well (recursively) using webpack. 

### `install`

Your code might depend on NPM packages. You can specify them with `install()`. They will be included in your deployment package.

```js
// l install(opencv2)
....
// lend
```

You probably want to import it as well:

```js 
// l install(opencv2) require(opencv2 as opencv)
   opencv2.detectFaces(...)
// lend
```

### `return`

Your monolith code may have no return statement. To receive something back from the FaaS function, use `return()`
```js
// l return(a)  
  var a = 1
  var b = 2
// lend
```


-----

## Useful hints

### Multiple parameters

With most `// l` expressions, you can provide a comma-separated list too:

```js
// l install(lodash, rollup, express)
...
```

### Aliasing

You have to provide a name or alias for everything you `require`:

**For NPM packages:**

```js
// l require(opencv2 as cv)
  cv.detectFaces(...)
// lend
```

**For functions:**

```js
// l require(./external.js as external)
  ...
// lend
``` 

<!-- ### Versioning

You can specify the exact versions of the NPM packages to install:

```js
// l install(pkg1@latest, pkg2^1.0.0, pkg3>=1.2.3)
...
// lend
```

The syntax follows this official schema: https://docs.npmjs.com/misc/semver -->
