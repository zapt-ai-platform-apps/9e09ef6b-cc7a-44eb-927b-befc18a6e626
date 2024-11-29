import { createSignal, For, Show } from 'solid-js';
import { createEvent, supabase } from '../supabaseClient';
import AddDeadline from './AddDeadline';

function Schedule(props) {
  const [deadlines, setDeadlines] = createSignal([]);
  const [schedule, setSchedule] = createSignal([]);
  const [loading, setLoading] = createSignal(false);

  const handleAddDeadline = (newDeadline) => {
    setDeadlines([...deadlines(), newDeadline]);
  };

  const generateSchedule = async () => {
    setLoading(true);
    try {
      // Prepare the prompt for the AI
      const prompt = `I am a student with the following deadlines and events:
${deadlines().map((d, i) => `${i + 1}. ${d.type}: ${d.name} on ${d.date}`).join('\n')}
Please create a personalized study schedule for me, automatically categorizing and scheduling university application deadlines, exam dates, and study sessions. Generate reminders and adjust schedules as deadlines change. Provide the schedule in JSON format with the following structure:
{
  "schedule": [
    {
      "date": "YYYY-MM-DD",
      "tasks": [
        {
          "time": "HH:MM",
          "task": "Task description"
        }
      ]
    }
  ]
}`;

      const result = await createEvent('chatgpt_request', {
        prompt,
        response_type: 'json',
      });

      if (result && result.schedule) {
        setSchedule(result.schedule);
      } else {
        console.error('Invalid response from AI');
      }
    } catch (error) {
      console.error('Error generating schedule:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div class="max-w-6xl mx-auto">
      <div class="flex justify-between items-center mb-8">
        <h1 class="text-4xl font-bold text-purple-600">Deadline Planner AI</h1>
        <button
          class="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-6 rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-red-400 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
          onClick={async () => {
            await supabase.auth.signOut();
            props.setUser(null);
            props.setCurrentPage('login');
          }}
        >
          Sign Out
        </button>
      </div>

      {/* Add Deadline Component */}
      <AddDeadline onAddDeadline={handleAddDeadline} />

      {/* Deadlines List */}
      <Show when={deadlines().length > 0}>
        <div class="mt-6">
          <h2 class="text-2xl font-bold mb-4 text-purple-600">Your Deadlines</h2>
          <ul class="space-y-4">
            <For each={deadlines()}>
              {(deadline) => (
                <li class="bg-white p-4 rounded-lg shadow-md">
                  <p class="font-semibold">{deadline.type}: {deadline.name}</p>
                  <p class="text-gray-700">Date: {deadline.date}</p>
                </li>
              )}
            </For>
          </ul>
        </div>
      </Show>

      {/* Generate Schedule Button */}
      <div class="mt-6">
        <button
          class={`px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer ${loading() ? 'opacity-50 cursor-not-allowed' : ''}`}
          onClick={generateSchedule}
          disabled={loading()}
        >
          <Show when={loading()} fallback="Generate Schedule">
            Generating...
          </Show>
        </button>
      </div>

      {/* Schedule Display */}
      <Show when={schedule().length > 0}>
        <div class="mt-8">
          <h2 class="text-2xl font-bold mb-4 text-purple-600">Your Schedule</h2>
          <For each={schedule()}>
            {(day) => (
              <div class="mb-4">
                <h3 class="text-xl font-semibold mb-2">{day.date}</h3>
                <ul class="space-y-2">
                  <For each={day.tasks}>
                    {(task) => (
                      <li class="bg-white p-4 rounded-lg shadow-md">
                        <p class="font-semibold">{task.time} - {task.task}</p>
                      </li>
                    )}
                  </For>
                </ul>
              </div>
            )}
          </For>
        </div>
      </Show>

      {/* Made on ZAPT badge */}
      <div class="mt-8 text-center">
        <a href="https://www.zapt.ai" target="_blank" class="text-gray-500 hover:text-gray-700 underline">
          Made on ZAPT
        </a>
      </div>
    </div>
  );
}

export default Schedule;