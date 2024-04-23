const launchesMongo = require("./launches.mongo")
const planets = require("./planets.mongo")
const launches = new Map()

const DEFAULT_FLIGHT_NUMBER = 1

const launch = {
    flightNumber: 100,
    mission: 'Kepler Exploration X',
    rocket: 'Explorer IS1',
    launchDate: new Date('December 27, 2030'),
    target: 'Kepler-442 b',
    customer: ['ZTM', 'NASA'],
    upcoming: true,
    success: true,
}

saveLaunch(launch)

launches.set(launch.flightNumber, launch)

async function getAllLaunches() {
    return await launchesMongo.find({},{
        _id: 0,
        __v: 0   
    })
}

async function saveLaunch(launch){
    const planet = await planets.findOne({
        keplerName: launch.target
    })

    if(!planet){
        throw new Error('No matching planet found')
    }

    await launchesMongo.findOneAndUpdate({
        flightNumber: launch.flightNumber
    }, launch, {
        upsert: true
    })
}

async function getLatestFlightNumber(){
    const latestLaunch = await launchesMongo.findOne().sort('-flightNumber')

    if(!latestLaunch){
        return DEFAULT_FLIGHT_NUMBER
    }

    return latestLaunch.flightNumber
}

async function existsLaunchWithId(launchId){
    return await launchesMongo.findOne({
        flightNumber: launchId
    })
}

async function scheduleNewLaunch(launch){
    const newFlightNumber = await getLatestFlightNumber() + 1
    const newLaunch = Object.assign(launch,{
        success: true,
        upcoming: true,
        customer: ['ZTM', 'NASA'],
        flightNumber: newFlightNumber
    })

    await saveLaunch(newLaunch)
}

async function abortLaunchById(launchId){
    const aborted= await launchesMongo.updateOne({
        flightNumber: launchId
    },{
        upcoming: false,
        success: false
    })

    return aborted.modifiedCount === 1;
}

module.exports = {
    getAllLaunches,
    scheduleNewLaunch,
    existsLaunchWithId,
    abortLaunchById
}