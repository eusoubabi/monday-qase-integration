import fs from 'fs';

export const saveMapping = (itemId: string, testPlanId: string) => {
    let db: Record<string, string> = {};
    if (fs.existsSync('src/database.json')) {
        db = JSON.parse(fs.readFileSync('src/database.json', 'utf-8'));
    }
    db[itemId] = testPlanId;
    fs.writeFileSync('src/database.json', JSON.stringify(db));
};
