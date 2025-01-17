import ModbusRTU from 'modbus-serial'
import { mqttPublish } from './mqttclient.js';

import holdingRegisters from './holdingregisters.js';
import coils from './colis.js';
holdingRegisters[1] = 10
const vector = {
    getInputRegister: function(addr, unitID) {
        // Synchronous handling
        return addr;
    },
    getHoldingRegister: function(addr, unitID, callback) {
        // Asynchronous handling (with callback)
        callback(null, holdingRegisters[addr])
    },
    
    getCoil: function(addr, unitID) {
        // Asynchronous handling (with Promises, async/await supported)
        return new Promise(function(resolve) {
            setTimeout(function() {
                resolve(coils[addr]);
            }, 10);
        });
    },
    setRegister: function(addr, value, unitID) {
        // Asynchronous handling supported also here
        holdingRegisters[addr] = value
        return;
    },
    setCoil: function(addr, value, unitID) {
        // Asynchronous handling supported also here
        coils[addr] = value
        const int = value ? 1: 0
        console.log(int)
        mqttPublish(5, 5, addr, int)
        return;
    },
};

console.log("ModbusTCP listening on modbus://0.0.0.0:8502");
const serverTCP = new ModbusRTU.ServerTCP(vector, { host: "0.0.0.0", port: 502, debug: true, unitID: 1 });

serverTCP.on("socketError", function(err){
    // Handle socket error if needed, can be ignored
    console.error(err);
});