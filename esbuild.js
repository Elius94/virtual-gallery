/* eslint-disable no-useless-escape */
// esbuild.js
import { execSync } from "child_process"
import { build, context } from "esbuild"
import fs from "fs"
import figlet from "figlet"
import Compress from "compress-images"

const INPUT_IMAGE_PATH = "src/textures/**/*.{jpg,JPG,jpeg,JPEG,png,svg,gif}"
const OUTPUT_IMAGE_PATH = "public/textures/"

const pkg = JSON.parse(fs.readFileSync("./package.json"))

const watch = process.argv.includes("--watch")
const dev = process.argv.includes("--dev") || process.env.NODE_ENV === "development"

let firstBuild = true

const banner = "/* eslint-disable linebreak-style */\n" +
    "/*\n" +
    figlet.textSync("Eliusoutdoor Virtual Gallery", { horizontalLayout: "full", font: "Big" }) +
    "\n" +
    `                                                                                v${pkg.version}\n\n\n` +
    `   ${pkg.description}\n\n` +
    `   Author: ${pkg.author}\n` +
    `   License: ${pkg.license}\n` +
    `   Repository: ${pkg.repository.url}\n\n` +
    `   Build date: ${new Date().toUTCString()}\n\n` +
    "   This program is free software: you can redistribute it and/or modify */\n\n"

const buildOptions = {
    entryPoints: ["src/app.ts"],
    bundle: true,
    minify: dev ? false : true,
    sourcemap: true,
    color: true,
    outdir: "public/dist",
    target: ['chrome58', 'firefox57', 'safari11', 'edge18'],
    banner: {
        js: banner
    },
    loader: {
        ".png": "dataurl",
        ".jpg": "dataurl",
        ".jpeg": "dataurl",
        ".gif": "dataurl",
        ".svg": "dataurl",
    },
    plugins: [
        {
            name: "TypeScriptDeclarationsPlugin",
            setup(build) {
                build.onEnd((result) => {
                    if (result.errors.length > 0) {
                        console.log("\u001b[31mESM Build failed!\u001b[37m")
                        console.log("\u001b[31mTypeScript declarations generation skipped!\u001b[37m")
                        process.exit(1)
                    }
                    execSync("npx tsc --emitDeclarationOnly")
                    console.log("\u001b[36mTypeScript declarations generated!\u001b[37m")
                    // copy src/index.html to public/index.html
                    fs.copyFileSync("src/index.html", "public/index.html")
                })
            }
        },
        {
            name: "CopyAssetsPlugin",
            setup(build) {
                build.onEnd((result) => {
                    if (result.errors.length > 0) {
                        console.log("\u001b[31mESM Build failed!\u001b[37m")
                        process.exit(1)
                    }
                    if (!firstBuild) {
                        return
                    }
                    firstBuild = false
                    Compress(INPUT_IMAGE_PATH, OUTPUT_IMAGE_PATH, {
                        compress_force: false,
                        statistic: true,
                        autoupdate: true,
                        
                    }, false,
                        { jpg: { engine: "mozjpeg", command: ["-quality", "60"] } },
                        { png: { engine: "pngquant", command: ["--quality=60-80", "-o"] } },
                        { svg: { engine: "svgo", command: "--multipass" } },
                        { gif: { engine: "false", command: false } },
                        function (error, completed, statistic) {
                            console.log("-------------");
                            console.log(error);
                            console.log(completed);
                            console.log(statistic);
                            console.log("-------------");
                        }
                    )
                    fs.cpSync("src/models", "public/models", { recursive: true })
                    // copy src/textures to public/textures if exists (the whole folder, recursively)
                    //fs.cpSync("src/textures", "public/textures", { recursive: true })

                    console.log("\u001b[36mAssets copied!\u001b[37m")
                })
            }
        }
    ]
}

if (dev) {
    const ctx = await context(buildOptions)

    if (watch) await ctx.watch().then(() => {
        console.log("\u001b[36mWatching...\u001b[37m")
    })

    // Enable serve mode
    await ctx.serve({
        servedir: "public",
        port: 8080,
        onRequest: (args) => {
            if (args.path === "/") {
                args.path = "/index.html"
            }
            console.log(`\u001b[36m${args.method} ${args.path}\u001b[37m`)
        }
    }).then((server) => {
        console.log(`\u001b[36mServing at http://localhost:${server.port}\u001b[37m`)
        // Open browser
        switch (process.platform) {
            case "darwin":
                execSync(`open http://localhost:${server.port}`)
                break
            case "win32":
                execSync(`start http://localhost:${server.port}`)
                break
            default:
                execSync(`xdg-open http://localhost:${server.port}`)
        }
    })
} else {
    await build(buildOptions)
}

console.log("\u001b[36mESM Build succeeded!\u001b[37m")

// Enable watch mode
