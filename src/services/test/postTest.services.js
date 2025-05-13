const { number } = require("joi");
const { dbQuery } = require("../../utils/dbFunctions");

const postTestService = {
  postTest: async (req, res) => {
    let query;
    console.log(req.body);

    const { name, age, number, status } = req.body;
    if (name === undefined)
      return {
        success: false,
        message: "please provide name",
      };
    if (age === undefined)
      return {
        success: false,
        message: "please provide age",
      };
    if (number === undefined)
      return {
        success: false,
        message: "please provide number",
      };
    if (status === undefined)
      return {
        success: false,
        message: "please provide status",
      };
    // if (bankTag === undefined)
    //   return {
    //     success: false,
    //     message: "please provide bankTag",
    //   };

    query = `INSERT INTO test(
                name,
                age,
                number,
                status
            )
            VALUES (
                "${name}",
                ${age},
                ${number},
                "${status}"
            )`;

    console.log(query);

    const result = await dbQuery(query);

    return {
      success: true,
      message: "New test added",
      result,
    };
  },
};

module.exports = postTestService;
