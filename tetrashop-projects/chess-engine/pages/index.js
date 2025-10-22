// 📁 central-dashboard/pages/index.js
export default function CentralDashboard() {
  const projects = [
    {
      id: 'chess',
      title: 'Chess Engine',
      status: 'completed',
      description: 'موتور شطرنج هوشمند',
      icon: '♟️'
    },
    {
      id: 'writer', 
      title: 'Intelligent Writer',
      status: 'completed',
      description: 'تولید محتوا هوشمند',
      icon: '✍️'
    },
    {
      id: 'quantum',
      title: 'Quantum Writer', 
      status: 'active',
      description: 'نویسنده کوانتومی',
      icon: '⚛️'
    }
  ];

  const handleRunProject = async (projectId) => {
    try {
      const response = await fetch('/api/projects/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }

      // نمایش موفقیت
      showSuccessNotification(`پروژه ${projectId} با موفقیت اجرا شد`);
      
    } catch (error) {
      showErrorNotification(`خطا در اجرای پروژه: ${error.message}`);
    }
  };

  return (
    <div className="dashboard">
      <h1>🚀 پنل مدیریت پروژه‌های Tetrashop</h1>
      
      <div className="projects-grid">
        {projects.map(project => (
          <ProjectCard
            key={project.id}
            {...project}
            onRun={() => handleRunProject(project.id)}
          />
        ))}
      </div>
    </div>
  );
              }
