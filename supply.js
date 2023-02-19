const fs = require('fs');

/* Function to read the file and filter out the whitespace */
const readSupplyFile = (cb) => {
    fs.readFile("supply.txt", "utf-8", (err, data) => {
        if (err) {
            cb(err, null);
        } else {
            cb(null, data.split('\r\n').filter((coffee) => coffee !== ''))
        }
    })
}

/* Function to return an object of the coffee type and the amount left */
const viewCoffeeSupply = (coffeeType, cb) => {
    readSupplyFile((err, data) => {
        if (err) {
            cb(err, null)
        } else {
            const filteredData = data.filter(coffee => coffee === coffeeType)
            const result = {
                coffeeType: coffeeType,
                supply: filteredData.length
            }
            cb(null, result)
        }
    })
}

/* Function to convert the user input to match the text file format */
const usrInput = (coffeeType, cb) => {
    const validCoffees = [`DR`, `MR`, `B`]
    const coffees = [`dark-roast`, `medium-roast`, `blonde`]
    if (!validCoffees.includes(coffeeType)) {
        cb("Invalid coffee type. Choose either 'DR', 'MR', or 'B'", null)
    }else {
        for (i = 0; i < validCoffees.length; i++) {
            if (validCoffees[i] == coffeeType) {
                const newCoffeeType = coffees[i]
                cb(null, newCoffeeType)
            }
        }
    }
}

/* Function returns a number of how much of the specified coffee type is left */
const viewAllSupply = (coffeeType, cb) => {
    usrInput(coffeeType, (err, data) => {
        if (err) {
            cb(err, null)
        } else {
            viewCoffeeSupply(data, (err, data) => {
                if (err) {
                    cb(err, null)
                } else {
                    cb(null, data.supply)
                }
            })
        }
    })
}

/* Function adds one supply on the chosen coffee type */
const addSupply = (coffeeType, cb) => {
    usrInput(coffeeType, (err, data) => {
        if (err) {
            cb(err, null)
        } else {
            fs.appendFile("supply.txt", `\r\n${data}`, (err, data) => {
                if (err) {
                    cb(err, null)
                } else {
                    viewAllSupply(coffeeType, (err, data) => {
                        if (err) {
                            cb(err, null)
                        } else {
                            cb(null, data)
                        }
                    })
                }
            })
        }
    })
}

/* Function deletes the given amount for the given coffee type */
const deleteSupply = (coffeeType, amount, cb) => {
    readSupplyFile((err, coffeeData) => {
        if (err) {
            cb(err, null)
        } else {
            usrInput(coffeeType, (err, newCoffeeType) => {
                if (err) {
                    cb(err, null)
                } else {
                    const filteredData = coffeeData.filter(coffee => coffee === newCoffeeType)
                    const supplyCount = filteredData.length
                    if (supplyCount < amount) {
                        cb(`Cannot delete ${amount} ${newCoffeeType} coffee(s). Only ${supplyCount} available.`, null)
                    } else {
                        let newSupply = []
                        let deleteCount = 0
                        for (let i = 0; i < coffeeData.length; i++) {
                            if (coffeeData[i] === newCoffeeType && deleteCount < amount) {
                                deleteCount++
                            } else {
                                newSupply.push(coffeeData[i])
                            }
                        }
                        fs.writeFile("supply.txt", newSupply.join('\r\n'), (err) => {
                            if (err) {
                                cb(err, null)
                            } else {
                                cb(null, `${amount} ${newCoffeeType} coffee(s) deleted.`)
                            }
                        })
                    }
                }
            })
        }
    })
}


/* Tests the functions */
viewAllSupply('B', (err, data) => {
    if (err) {
        console.log(err)
    } else {
        console.log(data)
        addSupply('B', (err, data) => {
            if (err) {
                console.log(err)
            } else {
                console.log((data))
                viewAllSupply('B', (err, data) => {
                    if (err) {
                        console.log(err)
                    } else {
                        console.log(data)
                        deleteSupply('B', 2, (err, data) => {
                            if (err) {
                                console.log(err)
                            } else {
                                console.log(data)
                                viewAllSupply('B', (err, data) => {
                                    if (err) {
                                        console.log(err)
                                    } else {
                                        console.log(data)
                                        console.log('Program is completed')
                                    }
                                })
                            }
                        })
                    }
                })
            }
        })
    }
})