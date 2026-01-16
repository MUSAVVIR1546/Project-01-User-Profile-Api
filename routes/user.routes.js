import express from "express";
import fs from "fs";

const router = express.Router();

const readUsers = () => {
    const data = fs.readFileSync("./MOCK_USERS.json", "utf-8")
    return JSON.parse(data);
};

const writeUsers = (users) => {
    fs.writeFileSync("./MOCK_USERS.json", JSON.stringify(users, null, 2));
}

// Post
router.post("/", (req, res) => {
    const { user_name, password } = req.body;

    if (!user_name || !password) {
        return res.status(400).json({ message: "user_name and password are required" })
    };

    const users = readUsers()

    const exists = users.find((u) => u.user_name === user_name);

    if (exists) {
        return res.status(400).json({ message: "user_name already exists" })
    };

    const newUser = {
        id: users.length + 1,
        user_name,
        password
    }

    users.push(newUser);
    writeUsers(users);

    return res.status(201).json({ status: "success", user: newUser });
})

// Patch
router.patch("/:id", (req, res) => {
    const id = Number(req.params.id);
    const { user_name, password } = req.body;

    const users = readUsers();
    const user = users.find((u) => u.id === id);

    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    if (user_name) {
        const already = users.find((u) => u.user_name === user_name && u.id !== id);
        if (already) {
            return res.status(400).json({ message: "user_name is already exists" });
        }
        user.user_name = user_name;
    }
    if (password) {
        user.password = password;
    }

    writeUsers(users);

    return res.json({ stauts: "Updated", user });
});

// Delete
router.delete("/:id", (req, res) => {
    const id = Number(req.params.id);

    const users = readUsers();
    const index = users.findIndex((u) => u.id === id);

    if (index === -1) {
        return res.status(404).json({ message: "user not found" });
    }
    const deletedUser = users.splice(index, 1);
    writeUsers(users);

    return res.json({ status: "Deleted", user: deletedUser })
})


export default router;