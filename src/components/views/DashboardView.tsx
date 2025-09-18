import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { AuthService } from "@/features/auth/services/auth.service";
import { ProjectsService } from "@/features/projects/services/projects.service";
import type { Project } from "@/features/projects/models/projects.models";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  LogOut,
  AlertCircleIcon,
} from "lucide-react";
import MainLayout from "@/layouts/MainLayout";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { LOADING_SKELETON_COUNT } from "@/constants/ui";
import { formatProjectType, getProjectTypeStyles, truncateTags, formatActivityCount } from "@/utils/formatting";

export function Dashboard() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setIsLoading(true);
        const projectsList = await ProjectsService.getMyUserProjects({
          slight: true,
          order_by: "user_order",
        });
        setProjects(projectsList);
      } catch (err: any) {
        setError(err.message || "Error loading projects");
        console.error("Error fetching projects:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const handleProjectClick = (project: Project) => {
    navigate(`/projects/${project.id}/milestones`);
  };

  const handleLogout = () => {
    AuthService.logout();
    window.location.reload();
  };

  return (
    <MainLayout>
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-stone-900">Dashboard</h1>
        <Button onClick={handleLogout} variant="outline">
          <LogOut />
          <span>Logout</span>
        </Button>
      </div>

      <div>
        {error && (
          <Alert variant="destructive" className="my-6">
            <AlertCircleIcon />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              <p>{error}</p>
            </AlertDescription>
          </Alert>
        )}

        <section>
          <h2 className="text-2xl font-semibold mb-6">My Projects</h2>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(LOADING_SKELETON_COUNT)].map((_, i) => (
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
          ) : projects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <Card
                  key={project.id}
                  className="min-w-60 min-h-56 hover:shadow-lg transition-shadow cursor-pointer flex flex-col justify-between"
                  onClick={() => handleProjectClick(project)}
                >
                  <CardHeader>
                    <CardTitle className="text-lg text-stone-700">
                      {project.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm text-stone-600">
                        <span>Type:</span>
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${getProjectTypeStyles(project.is_private)}`}
                        >
                          {formatProjectType(project.is_private)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm text-stone-600">
                        <span>Activity:</span>
                        <span>{formatActivityCount(project.total_activity)}</span>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-1">
                      {(() => {
                        const { displayed, remaining, hasMore } = truncateTags(project.tags);
                        return (
                          <>
                            {displayed.map((tag, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded"
                              >
                                {tag}
                              </span>
                            ))}
                            {hasMore && (
                              <span className="px-2 py-1 bg-stone-100 text-stone-600 text-xs rounded">
                                +{remaining} more
                              </span>
                            )}
                          </>
                        );
                      })()}
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
        </section>
      </div>
    </MainLayout>
  );
}
