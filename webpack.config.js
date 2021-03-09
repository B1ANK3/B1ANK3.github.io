const path = require('path')
const glob = require('glob')


// Return Array of Configurations
module.exports = async env => {
    // console.log(env)

    /* Check if enviroment is production or development */
    var mode = Object.keys(env).includes('production') ? 'production' : Object.keys(env).includes('development') ? 'development' : process.exit(1)

    /* If developer add source map */
    var devtool = mode === 'production' ? '' : 'inline-source-map'

    console.log(`Webpack Configuration: [ENVIRO]: ${mode}`);
    console.log(`Webpack Configuration: [DEVTOOL]: ${devtool ? 'yes' : 'no'}`)

    return await createConfigs(mode, devtool, env)
}

function createConfigs(mode, devtool, argv) {

    /**
     * Base Config
     */
    var config = {
        mode: mode,
        resolve: {
            extensions: [".ts", ".tsx", ".js"]
        },
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    loader: "ts-loader"
                }
            ],
        },
        plugins: [
            // new CleanWebpackPlugin(),
        ]
    };

    if (devtool) Object.assign(config, { devtool: devtool })

    // getDirectories((err, res) => {
    //     var rf = res.filter(pre => !pre.includes('node_modules') && pre.endsWith('.ts'))
    //     var compilerfiles = []
    //     rf.forEach(element => {
    //         var pPath = path.resolve(element),
    //             pFileName = path.basename(element),
    //             pName = path.basename(element, path.extname(element))
    //         compilerfiles.push(Object.assign({}, config, {
    //             name: pName,
    //             entry: pFileName,
    //             output: {
    //                 path: pPath,
    //                 filename: "[name].js"
    //             }
    //         }))
    //     });
    //     console.log(compilerfiles)
    // })

    return new Promise((resolve, reject) => {
        glob(`./**/*`, (err, res) => { if (err) reject(err); resolve(res) })
    }).then(res => {
        var rf = res.filter(pre => !pre.includes('node_modules') && pre.endsWith('.ts'))
        var compilerfiles = []
        rf.forEach(element => {
            var pPath = path.resolve(element),
                pFileName = path.basename(element),
                pName = path.basename(element, path.extname(element))
            compilerfiles.push(Object.assign({}, config, {
                name: pName,
                entry: element,
                output: {
                    path: path.resolve(__dirname, path.dirname(element)),
                    filename: `${pName}.js`
                }
            }))
        });
        return compilerfiles
    }).then(completeFiles => {
        console.log(completeFiles)
        return completeFiles
    })

    // /**
    //  * Main Config for page index
    //  */
    // var mainConfig = Object.assign({}, config, {
    //     name: "index",
    //     entry: "./lib/main/index.ts",
    //     output: {
    //         path: path.resolve(__dirname, outpath),
    //         filename: "index.js"
    //     }
    // });
    // /**
    //  * Popup Config for extension
    //  */
    // var popupConfig = Object.assign({}, config, {
    //     name: "popup",
    //     entry: "./lib/popup/popup.ts",
    //     output: {
    //         path: path.resolve(__dirname, outpath),
    //         filename: "popup.js"
    //     },
    // });
    // /**
    //  * Background Config for extensions
    //  */
    // var backgroundConfig = Object.assign({}, config, {
    //     name: "background",
    //     entry: "./lib/background/background.ts",
    //     output: {
    //         path: path.resolve(__dirname, outpath),
    //         filename: "background.js"
    //     },
    // });

    return [
        // mainConfig,
        // popupConfig,
        // backgroundConfig,
    ]
}