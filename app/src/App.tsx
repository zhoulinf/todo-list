import { KanbanBoard } from "./components/KanbanBoard";

function App() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <header className="max-w-5xl mx-auto mb-6">
        <h1 className="text-2xl font-bold text-gray-900">任务看板</h1>
        <p className="text-sm text-gray-500 mt-1">
          拖拽任务卡片来更改状态或调整排序
        </p>
      </header>
      <main className="max-w-5xl mx-auto">
        <KanbanBoard />
      </main>
    </div>
  );
}

export default App;
