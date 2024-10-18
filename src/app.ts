import { join } from 'path'
import { createBot, createProvider, createFlow, addKeyword, utils } from '@builderbot/bot'
import { MemoryDB as Database } from '@builderbot/bot'
import { BaileysProvider as Provider } from '@builderbot/provider-baileys'


const PORT = process.env.PORT ?? 3008

// Para los tiempos en el wait
const waitT = (ms: number) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(ms)
        }, ms)
    })
}

import path from 'path';
import { readFileSync } from 'fs';

// Importacion de txt
const metodosPath = path.join(process.cwd(), "mensajes", "metodos.txt");
const metodos = readFileSync(metodosPath, "utf8");
const anuncioPath = path.join(process.cwd(), "mensajes", "anuncio.txt");
const anuncio = readFileSync(anuncioPath, "utf8");
const claroPath = path.join(process.cwd(), "mensajes", "claro.txt");
const claro = readFileSync(claroPath, "utf8");
const libertyPath = path.join(process.cwd(), "mensajes", "liberty.txt");
const liberty = readFileSync(libertyPath, "utf8");
const pruebaPath = path.join(process.cwd(), "mensajes", "prueba.txt");
const prueba = readFileSync(pruebaPath, "utf8");
const vpnPath = path.join(process.cwd(), "mensajes", "vpn.txt");
const vpn = readFileSync(vpnPath, "utf8");



const welcomeFlow1 = addKeyword<Provider, Database>(['#terminos'])
    .addAnswer(`Terminos y condiciones`)
    .addAction(
        async (ctx, { provider, flowDynamic }) => {
            //await flowDynamic('*Poll*')
            const number = ctx.key.remoteJid
            await provider.vendor.sendMessage(
                number, {
                poll:
                {
                    "name": "Aceptas los terminos y condiciones?",
                    "values": ["Si", "No"],
                    "selectableCount": 1,
                }
            }
            )
        }
    )


// Anuncio 50gb
const Promo50gb = addKeyword<Provider, Database> (['#50gb'])
.addAction(
    async (ctx, { provider }) => {
        await provider.vendor.sendMessage(ctx.key.remoteJid, { react: { text: '💥', key: ctx.key } });  //Funcion para reaccionar
        await provider.vendor.sendPresenceUpdate('composing', ctx.key.remoteJid) //Funcion para escribiendo...
        await waitT(3000)})
    .addAnswer(anuncio, { media: join(process.cwd(), 'BOT', 'Anuncio.png') })
    .addAction(async () => {
    await waitT(3000);}) 
    .addAnswer(['🚀 *¿Quieres probar GRATIS el servicio por 2 días?*' , '-Envia un mensaje con la palabra *#prueba*'])

// Prueba del servicio VPN
const PruebaVPN = addKeyword<Provider, Database> (['#prueba'])
.addAction(
    async (ctx, { provider }) => {
        await provider.vendor.sendMessage(ctx.key.remoteJid, { react: { text: '🚀', key: ctx.key } });
        await provider.vendor.sendPresenceUpdate('composing', ctx.key.remoteJid)
        await waitT(3000)})
    .addAnswer(prueba, { media: join(process.cwd(), 'BOT','TokenVideo.mp4') })
    .addAnswer('💥Si realizaste la prueba con el bot, envia *#usobasico* para recibir un video muy importante sobre como usar la aplicacion!💥')    



// Metodos de Pagos
const MetodosDePago = addKeyword<Provider, Database> (['#metodos'])
.addAction(
    async (ctx, { provider }) => {
        await provider.vendor.sendMessage(ctx.key.remoteJid, { react: { text: '🤑', key: ctx.key } });  //Funcion para reaccionar
        await provider.vendor.sendPresenceUpdate('composing', ctx.key.remoteJid)
        await waitT(3000)})
    .addAnswer(metodos, { media: join(process.cwd(), 'BOT', 'metodos.jpg') })

// Video del uso basico
const UsoBasico50gb = addKeyword<Provider, Database> (['#usobasico'])
.addAction(
    async (ctx, { provider }) => {
        await provider.vendor.sendMessage(ctx.key.remoteJid, { react: { text: '💡', key: ctx.key } });  //Funcion para reaccionar
        await provider.vendor.sendPresenceUpdate('composing', ctx.key.remoteJid)
        await waitT(3000)})
.addAnswer('⬆️Favor ver el video completo!⬆️', { media: join(process.cwd(), 'BOT', 'UsoBasico.mp4') })

// Uso de las VPN
const VPN = addKeyword<Provider, Database> (['#vpn'])
.addAction(
    async (ctx, { provider }) => {
        await provider.vendor.sendPresenceUpdate('composing', ctx.key.remoteJid)
        await waitT(3000)})
    .addAnswer(vpn, { media: join(process.cwd(), 'BOT', 'vpn.png') })

// Formas de uso de Claro
const ClaroVPN = addKeyword<Provider, Database> (['#claro'])
.addAction(
    async (ctx, { provider }) => {
        await provider.vendor.sendPresenceUpdate('composing', ctx.key.remoteJid)
        await waitT(3000)})
    .addAnswer(claro, { media: join(process.cwd(), 'BOT', 'claro.png') })

// Formas de uso de Liberty
const LibertyVPN = addKeyword<Provider, Database> (['#liberty'])
.addAction(
    async (ctx, { provider }) => {
        await provider.vendor.sendPresenceUpdate('composing', ctx.key.remoteJid)
        await waitT(3000)})
    .addAnswer(liberty, { media: join(process.cwd(), 'BOT', 'liberty.png') })    

        
const discordFlow = addKeyword<Provider, Database>('doc').addAnswer(
    ['You can see the documentation here', '📄 https://builderbot.app/docs \n', 'Do you want to continue? *yes*'].join(
        '\n'
    ),
    { capture: true },
    async (ctx, { gotoFlow, flowDynamic }) => {
        if (ctx.body.toLocaleLowerCase().includes('yes')) {
            return gotoFlow(registerFlow)
        }
        await flowDynamic('Thanks!')
        return
    }
)

const welcomeFlow = addKeyword<Provider, Database>(['#a'])
    .addAnswer(`🙌 Hello welcome to this *Chatbot*`)
    .addAnswer(
        [
            'I share with you the following links of interest about the project',
            '👉 *doc* to view the documentation',
        ].join('\n'),
        { delay: 800, capture: true },
        async (ctx, { fallBack }) => {
            if (!ctx.body.toLocaleLowerCase().includes('doc')) {
                return fallBack('You should type *doc*')
            }
            return
        },
        [discordFlow]
    )

const registerFlow = addKeyword<Provider, Database>(utils.setEvent('#b'))
    .addAnswer(`What is your name?`, { capture: true }, async (ctx, { state }) => {
        await state.update({ name: ctx.body })
    })
    .addAnswer('What is your age?', { capture: true }, async (ctx, { state }) => {
        await state.update({ age: ctx.body })
    })
    .addAction(async (_, { flowDynamic, state }) => {
        await flowDynamic(`${state.get('name')}, thanks for your information!: Your age: ${state.get('age')}`)
    })

const fullSamplesFlow = addKeyword<Provider, Database>(['samples', utils.setEvent('SAMPLES')])
    .addAnswer(`💪 I'll send you a lot files...`)
    .addAnswer(`Send image from Local`, { media: join(process.cwd(), 'assets', 'sample.png') })
    .addAnswer(`Send video from URL`, {
        media: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExYTJ0ZGdjd2syeXAwMjQ4aWdkcW04OWlqcXI3Ynh1ODkwZ25zZWZ1dCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/LCohAb657pSdHv0Q5h/giphy.mp4',
    })
    .addAnswer(`Send audio from URL`, { media: 'https://cdn.freesound.org/previews/728/728142_11861866-lq.mp3' })
    .addAnswer(`Send file from URL`, {
        media: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    })



// Colocar los flows a usar    
const main = async () => {
    const adapterFlow = createFlow([MetodosDePago, UsoBasico50gb, Promo50gb, VPN, ClaroVPN, LibertyVPN, PruebaVPN])
    
    const adapterProvider = createProvider(Provider)
    const adapterDB = new Database()

    const { handleCtx, httpServer } = await createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    })

    adapterProvider.server.post(
        '/v1/messages',
        handleCtx(async (bot, req, res) => {
            const { number, message, urlMedia } = req.body
            await bot.sendMessage(number, message, { media: urlMedia ?? null })
            return res.end('sended')
        })
    )

    adapterProvider.server.post(
        '/v1/register',
        handleCtx(async (bot, req, res) => {
            const { number, name } = req.body
            await bot.dispatch('REGISTER_FLOW', { from: number, name })
            return res.end('trigger')
        })
    )

    adapterProvider.server.post(
        '/v1/samples',
        handleCtx(async (bot, req, res) => {
            const { number, name } = req.body
            await bot.dispatch('SAMPLES', { from: number, name })
            return res.end('trigger')
        })
    )

    adapterProvider.server.post(
        '/v1/blacklist',
        handleCtx(async (bot, req, res) => {
            const { number, intent } = req.body
            if (intent === 'remove') bot.blacklist.remove(number)
            if (intent === 'add') bot.blacklist.add(number)

            res.writeHead(200, { 'Content-Type': 'application/json' })
            return res.end(JSON.stringify({ status: 'ok', number, intent }))
        })
    )

    httpServer(+PORT)
}

main()
