import { useEffect, useState } from "react";
import { AuthService } from "@/lib/services/auth";
import { ProjectsService } from "@/lib/services/projects";
import { MilestonesService } from "@/lib/services/milestones";
import type { Project, Milestone } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Calendar, Target, Users } from "lucide-react";

export function Dashboard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMilestonesLoading, setIsMilestonesLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setIsLoading(true);
        const projectsList = await ProjectsService.getMyUserProjects({
          slight: true,
          order_by: 'user_order'
        });
        setProjects(projectsList);
      } catch (err: any) {
        setError(err.message || 'Error loading projects');
        console.error('Error fetching projects:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const handleProjectClick = async (project: Project) => {
    setSelectedProject(project);
    setIsMilestonesLoading(true);
    setError(null);

    try {
      const projectMilestones = await MilestonesService.getProjectMilestones(project.id, false);
      setMilestones(projectMilestones);
    } catch (err: any) {
      setError(err.message || 'Error loading milestones');
      console.error('Error fetching milestones:', err);
    } finally {
      setIsMilestonesLoading(false);
    }
  };

  const handleBackToProjects = () => {
    setSelectedProject(null);
    setMilestones([]);
    setError(null);
  };

  const handleLogout = () => {
    AuthService.logout();
    window.location.reload();
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            {selectedProject && (
              <Button onClick={handleBackToProjects} variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Projects
              </Button>
            )}
            <h1 className="text-3xl font-bold text-gray-900">
              {selectedProject ? selectedProject.name : 'Dashboard'}
            </h1>
          </div>
          <Button onClick={handleLogout} variant="outline">
            Logout
          </Button>
        </div>

        {error && (
          <div className="mb-6 p-4 text-red-600 bg-red-50 border border-red-200 rounded-md">
            {error}
          </div>
        )}

        {!selectedProject ? (
          // Projects View
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">My Projects</h2>
            
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <CardHeader>
                      <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </CardHeader>
                    <CardContent>
                      <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : projects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project) => (
                  <Card 
                    key={project.id} 
                    className="hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => handleProjectClick(project)}
                  >
                    <CardHeader>
                      <CardTitle className="text-lg">{project.name}</CardTitle>
                      <CardDescription className="text-sm">
                        {project.description || 'No description available'}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm text-gray-600">
                          <span>Owner:</span>
                          <span className="font-medium">{project.owner.full_name_display}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm text-gray-600">
                          <span>Type:</span>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            project.is_private ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                          }`}>
                            {project.is_private ? 'Private' : 'Public'}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm text-gray-600">
                          <span>Milestones:</span>
                          <span>{project.total_milestones || 0}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm text-gray-600">
                          <span>Activity:</span>
                          <span>{project.total_activity} events</span>
                        </div>
                      </div>
                      
                      <div className="mt-4 flex flex-wrap gap-1">
                        {project.tags.slice(0, 3).map((tag, index) => (
                          <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                            {tag}
                          </span>
                        ))}
                        {project.tags.length > 3 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                            +{project.tags.length - 3} more
                          </span>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>No Projects Found</CardTitle>
                  <CardDescription>
                    You don't have any projects yet or they couldn't be loaded.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    onClick={() => window.location.reload()} 
                    variant="outline"
                  >
                    Retry
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        ) : (
          // Milestones View
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Project Milestones</h2>
            
            {isMilestonesLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[...Array(4)].map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <CardHeader>
                      <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </CardHeader>
                    <CardContent>
                      <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : milestones.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {milestones.map((milestone) => (
                  <Card key={milestone.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Target className="h-5 w-5" />
                        {milestone.name}
                      </CardTitle>
                      <CardDescription className="text-sm">
                        {milestone.closed ? (
                          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                            Closed
                          </span>
                        ) : (
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                            Active
                          </span>
                        )}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="h-4 w-4" />
                          <span>
                            {formatDate(milestone.estimated_start)} - {formatDate(milestone.estimated_finish)}
                          </span>
                        </div>
                        
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Story Points:</span>
                          <span className="font-medium">
                            {milestone.closed_points || 0} / {milestone.total_points || 0}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Users className="h-4 w-4" />
                          <span>{milestone.user_stories.length} User Stories</span>
                        </div>
                        
                        {milestone.total_points && milestone.total_points > 0 && (
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ 
                                width: `${((milestone.closed_points || 0) / milestone.total_points) * 100}%` 
                              }}
                            ></div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>No Active Milestones</CardTitle>
                  <CardDescription>
                    This project doesn't have any active milestones yet.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    onClick={() => handleProjectClick(selectedProject)} 
                    variant="outline"
                  >
                    Refresh
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
}