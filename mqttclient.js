import mqtt from "mqtt";
import holdingRegisters from "./holdingregisters.js";
import coils from "./colis.js";
const plcAddress = '192.168.0.25'
const plcPort  = 502
const plcID = 1
const publishTopic = 'ssi/ttl/request'
const subscribeTopic = 'ssi/ttl/response'
const options = {
    host: 'test.mosquitto.org',
    port: 1883
}

const client = mqtt.connect(options)

client.on('connect', () => {
    console.log('Mqtt is Connected')
    client.subscribe(subscribeTopic, (err) => {
        console.log(err)
    })

    setInterval(() => {
        sendRequest()
    }, 500)
})

client.on('error', (err) => {
    console.log(err)
})

const sendRequest = () => {
    const holdings = `0 3 0 ${plcAddress} ${plcPort} 5 ${plcID} 3 1 10`
    const coils = `0 1 0 ${plcAddress} ${plcPort} 5 ${plcID} 1 1 10`
    client.publish(publishTopic, holdings)
    client.publish(publishTopic, coils)
}


export const mqttPublish = (ck, fc, addr, val) => {
    const formatReq = `0 ${ck} 0 ${plcAddress} ${plcPort} 5 ${plcID} ${fc} ${addr} ${val}`
    console.log(formatReq)
    client.publish(publishTopic, formatReq)
}



client.on('message', (topic, message) => {
    const data = message.toString().split(" ")
    const trascationID = parseInt(data[0])
    const registData = data.slice(2).map(Number)
    // console.log(data)
    switch (trascationID) {
        case 1: {
            for (let i = 0; i < registData.length; i++) {
                const addr = i + 1
                const val = registData[i]
                coils[addr] = val
            }
            break
        }
        case 2: {
            console.log('hallo 3')
            break
        }
        case 3: {
            // console.log('hallo', registData)
            for ( let i = 0; i < registData.length; i++) {
                const addr = i + 1
                const val = registData[i]
                holdingRegisters[addr] = val
            }
            break
        }
        case 4: {
            console.log('hallo 3')
            break
        }
        case 5: {
            console.log('coil', data)
            break
        }
        case 6: {
            console.log('hallo 3')
            break
        }
        
    }
})

