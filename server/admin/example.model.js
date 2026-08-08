async function addExample(connection, meaningId, example) {

    const [result] = await connection.query(
        `
        INSERT INTO examples
        (
            meaning_id,
            english_example,
            hanifi_example
        )
        VALUES
        (?, ?, ?)
        `,
        [
            meaningId,
            example.english_example,
            example.hanifi_example
        ]
    );

    return result.insertId;

}

module.exports = {
    addExample
};