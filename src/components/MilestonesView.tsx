import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { MilestonesService } from "@/features/milestones/services/milestones.service";
import { ProjectsService } from "@/features/projects/services/projects.service";
import type { Project } from "@/features/projects/models/projects.model";
import type { Milestone } from "@/features/milestones/models/milestones.model";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ArrowLeft,
  Calendar,
  Target,
  Users,
  AlertCircleIcon,
} from "lucide-react";
import MainLayout from "@/layouts/MainLayout";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";

interface MilestonesViewProps {
  project?: Project;
  onBackToProjects?: () => void;
}

export function MilestonesView({
  project: propProject,
  onBackToProjects,
}: MilestonesViewProps) {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(propProject || null);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        let currentProject = propProject;
        
        // If we don't have a project from props, try to get it from URL params
        if (!currentProject && projectId) {
          try {
            const projects = await ProjectsService.getMyUserProjects({
              slight: true,
              order_by: "user_order",
            });
            currentProject = projects.find(p => p.id.toString() === projectId);
            if (!currentProject) {
              setError("Project not found");
              return;
            }
            setProject(currentProject);
          } catch (err: any) {
            setError(err.message || "Error loading project");
            return;
          }
        }
        
        if (!currentProject) {
          setError("No project specified");
          return;
        }

        const projectMilestones = await MilestonesService.getProjectMilestones(
          currentProject.id,
          false
        );
        setMilestones(projectMilestones);
      } catch (err: any) {
        setError(err.message || "Error loading milestones");
        console.error("Error fetching milestones:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [propProject, projectId]);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Not set";
    return new Date(dateString).toLocaleDateString();
  };
  
  const getCompletionPercent = (milestone: Milestone) => {
    const total = milestone.total_points || 0;
    const closed = milestone.closed_points || 0;
    if (total <= 0) return 0;
    // calculate percent and round to 2 decimals
    const percent = (closed / total) * 100;
    return Math.round(percent * 100) / 100; // two decimals
  };
  
  const handleRefresh = () => {
    setIsLoading(true);
    setError(null);

    const fetchMilestones = async () => {
      try {
        const currentProject = project || propProject;
        if (!currentProject) {
          setError("No project available to refresh");
          return;
        }
        
        const projectMilestones = await MilestonesService.getProjectMilestones(
          currentProject.id,
          false
        );
        setMilestones(projectMilestones);
      } catch (err: any) {
        setError(err.message || "Error loading milestones");
        console.error("Error fetching milestones:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMilestones();
  };
  
  const handleBackToProjects = () => {
    if (onBackToProjects) {
      onBackToProjects();
    } else {
      navigate('/dashboard');
    }
  };

  const currentProject = project || propProject;
  
  if (!currentProject && !isLoading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center min-h-64">
          <Card>
            <CardHeader>
              <CardTitle>Project Not Found</CardTitle>
              <CardDescription>
                The requested project could not be found.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => navigate('/dashboard')} variant="outline">
                Go to Dashboard
              </Button>
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="flex justify-between items-center gap-4">
        <Button onClick={handleBackToProjects} variant="outline" size="sm">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Projects
        </Button>
      </div>

      {error && (
        <Alert variant="destructive" className="my-6">
          <AlertCircleIcon />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            <p>{error}</p>
          </AlertDescription>
        </Alert>
      )}

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-stone-900 mb-6">
          {currentProject?.name}
        </h1>
        <h2 className="text-2xl font-semibold text-stone-800 mb-4">
          Project Milestones
        </h2>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="animate-pulse min-w-60 min-h-56">
                <CardHeader>
                  <div className="h-6 bg-stone-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-stone-200 rounded w-1/2"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-4 bg-stone-200 rounded w-full mb-2"></div>
                  <div className="h-4 bg-stone-200 rounded w-2/3"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : milestones.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {milestones.map((milestone) => (
              <Card
                key={milestone.id}
                className="hover:shadow-lg transition-shadow  min-w-60 min-h-56"
              >
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
                    <div className="flex items-center gap-2 text-sm text-stone-600">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {formatDate(milestone.estimated_start)} -{" "}
                        {formatDate(milestone.estimated_finish)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-stone-600">Story Points:</span>
                      <span className="font-medium">
                        {milestone.closed_points || 0} /{" "}
                        {milestone.total_points || 0}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-stone-600">
                      <Users className="h-4 w-4" />
                      <span>{milestone.user_stories.length} User Stories</span>
                    </div>

                    <p>
                      {getCompletionPercent(milestone).toFixed(2)}% Complete
                    </p>

                    {milestone.total_points && milestone.total_points > 0 && (
                      <div className="w-full bg-stone-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{
                            width: `${getCompletionPercent(milestone)}%`,
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
              <Button onClick={handleRefresh} variant="outline">
                Refresh
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </MainLayout>
  );
}
