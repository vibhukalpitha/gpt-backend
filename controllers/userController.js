
export const listAgriWaste = async (req, res) => {
    res.json({ msg: "Farmer can sell agri-waste" });
};

export const viewMarketplace = async (req, res) => {
    res.json({ msg: "Buyer can view marketplace listings" });
};

export const adminDashboard = async (req, res) => {
    res.json({ msg: "Admin dashboard access granted" });
};

export const sellOrganicFertilizer = async (req, res) => {
    res.json({ msg: "Organic Fertilizer Seller can list and sell products" });
};

export const registerVehicle = async (req, res) => {    
    res.json({ msg: "Truck Driver can register vehicle and manage deliveries" });
};