import { table } from "../utils/airtable";
import auth0 from "../utils/auth0";

const ownsRecord = (handler) =>
  auth0.requireAuthentication(async (req, res) => {
    const { user } = await auth0.getSession(req);

    const { id } = req.body;

    try {
      const exisitingRecord = await table.find(id);

      if (!exisitingRecord || user.sub !== exisitingRecord.fields.userId) {
        res.statusCode = 404;
        return res.json({ msg: "Record not found" });
      }

      req.record = exisitingRecord;
      return handler(req, res);
    } catch (err) {
      console.err(err);
      res.statusCode = 500;
      return res.json({ msg: "Something went wrong" });
    }
  });

export default ownsRecord;
