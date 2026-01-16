import { profile } from "console";
import express from "express";
import fs, { read } from "fs";

const router = express.Router();

const readProfiles = () => {
    const data = fs.readFileSync("./MOCK_PROFILE.json", "utf-8");
    return JSON.parse(data);
}

const writeProfiles = (profiles) => {
    fs.writeFileSync("./MOCK_PROFILE.json", JSON.stringify(profiles, null, 2));
}

// Post Request
router.post("/", (req, res) => {
    const { address, phone, dob, email } = req.body;

    if (!address || !phone || !dob || !email) {
        return res.status(400).json({ message: "address,phone,dob and email is mandatory." })
    };

    const profiles = readProfiles();

    const newProfile = {
        id: profiles.length + 1,
        address,
        phone,
        dob,
        email
    };

    profiles.push(newProfile);
    writeProfiles(profiles);

    return res.status(201).json({ status: "success", profile: newProfile });
});

// Patch Request
router.patch("/:id", (req, res) => {
    const id = Number(req.params.id);
    const { address, phone, dob, email } = req.body;

    const profiles = readProfiles();
    const profile = profiles.find((p) => p.id === id);

    if (!profile) {
        return res.status(404).json({ message: "Profile not found" })
    }

    if (address) profile.address = address;
    if (phone) profile.phone = phone;
    if (dob) profile.dob = dob;
    if (email) profile.email = email;

    writeProfiles(profiles);

    return res.json({ status: "updated", profile })
});

router.delete("/:id", (req, res) => {
    const id = Number(req.params.id);

    const profiles = readProfiles();
    const index = profiles.findIndex((p) => p.id === id);

    if (index === -1) {
        return res.status(404).json({ message: "Profile not found!" })
    };

    const deletedProfile = profiles.splice(index, 1);
    writeProfiles(profiles);

    return res.json({ status: "Deleted", user: deletedProfile })
})

export default router;