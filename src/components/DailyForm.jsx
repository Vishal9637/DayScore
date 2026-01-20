import { useState } from "react";

const DailyForm = ({ onSave }) => {
  const [form, setForm] = useState({
    sleep: "",
    study: "",
    activity: "",
    screen: "",
    stress: "1",
  });

  const [loading, setLoading] = useState(false);

  const update = (k, v) => setForm({ ...form, [k]: v });

  const submit = async () => {
    const { sleep, study, activity, screen } = form;
    if (!sleep || !study || !activity || !screen) {
      alert("Please fill all fields");
      return;
    }

    setLoading(true);
    await onSave({
      sleep: +form.sleep,
      study: +form.study,
      activity: +form.activity,
      screen: +form.screen,
      stress: +form.stress,
    });
    setLoading(false);
  };

  return (
    <div className="grid text-black grid-cols-2 gap-4">

      <input
        className="input"
        type="number"
        placeholder="Sleep (hrs)"
        onChange={(e) => update("sleep", e.target.value)}
      />

      <input
        className="input"
        type="number"
        placeholder="Study (hrs)"
        onChange={(e) => update("study", e.target.value)}
      />

      <input
        className="input"
        type="number"
        placeholder="Exercise (min)"
        onChange={(e) => update("activity", e.target.value)}
      />

      <input
        className="input"
        type="number"
        placeholder="Screen Time (hrs)"
        onChange={(e) => update("screen", e.target.value)}
      />
<select
  className="input col-span-2 bg-slate-800 text-white focus:ring-sky-400"
  onChange={(e) => update("stress", e.target.value)}
>
  <option value="1" className="text-black bg-white">
    Low Stress
  </option>
  <option value="2" className="text-black bg-white">
    Medium Stress
  </option>
  <option value="3" className="text-black bg-white">
    High Stress
  </option>
</select>


      <button
        className="btn-primary col-span-2 mt-2"
        onClick={submit}
        disabled={loading}
      >
        {loading ? "Saving..." : "Save Day"}
      </button>
    </div>
  );
};

export default DailyForm;
