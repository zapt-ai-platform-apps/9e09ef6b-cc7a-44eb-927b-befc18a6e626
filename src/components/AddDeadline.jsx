import { createSignal } from 'solid-js';

function AddDeadline(props) {
  const [type, setType] = createSignal('Exam');
  const [name, setName] = createSignal('');
  const [date, setDate] = createSignal('');

  const handleSubmit = (e) => {
    e.preventDefault();
    props.onAddDeadline({
      type: type(),
      name: name(),
      date: date(),
    });
    setName('');
    setDate('');
  };

  return (
    <div class="mt-6">
      <h2 class="text-2xl font-bold mb-4 text-purple-600">Add Deadline</h2>
      <form onSubmit={handleSubmit} class="space-y-4">
        <div>
          <label class="block mb-1 font-semibold">Type</label>
          <select
            value={type()}
            onInput={(e) => setType(e.target.value)}
            class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent box-border"
          >
            <option value="Exam">Exam</option>
            <option value="Application">Application</option>
            <option value="Study Session">Study Session</option>
          </select>
        </div>
        <div>
          <label class="block mb-1 font-semibold">Name</label>
          <input
            type="text"
            placeholder="Name of the deadline"
            value={name()}
            onInput={(e) => setName(e.target.value)}
            class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent box-border"
            required
          />
        </div>
        <div>
          <label class="block mb-1 font-semibold">Date</label>
          <input
            type="date"
            value={date()}
            onInput={(e) => setDate(e.target.value)}
            class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent box-border"
            required
          />
        </div>
        <button
          type="submit"
          class="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
        >
          Add Deadline
        </button>
      </form>
    </div>
  );
}

export default AddDeadline;