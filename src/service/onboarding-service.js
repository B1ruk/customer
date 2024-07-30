const redis = require('../config/redis-config');
const {applicationStatus} = require("../model/applicationModel");

exports.loadOnboardings=async (role)=>{
    const keys = await redis.keys('*');
    let applicationDatas=[];

    for (let i=0;i<keys.length;i++){
        const applicationData = await redis.get(keys[i]);
        applicationDatas.push(JSON.parse(applicationData));
    }
    //filter application data by user role
    applicationDatas=applicationDatas
        .map(applicationData=>!applicationData['status']?{...applicationData,status:applicationStatus.PENDING}:applicationData)
        .filter(application=>{
        switch (role) {
            case 'CUSTOMER':
                return application.status;
            case 'PROCESSOR':
                return application.status;
            case 'APPROVER':
                return application.status && (application.status===applicationStatus.PROCESSING_ACCEPTED);
            default:
                return false;
        }
    });

    return applicationDatas;
}

exports.currentUserRole= async (req)=>{
    return await req.headers[process.env.X_USER_ROLES];
};

exports.currentUser= async (req)=>{
    return await req.headers[process.env.X_USER_ROLES];
};
