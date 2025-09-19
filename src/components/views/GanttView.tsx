import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router";
// @ts-ignore
import Gantt from "../../lib/frappe-gantt";
import { MilestonesService } from "@/features/milestones/services/milestones.service";
import { ProjectsService } from "@/features/projects/services/projects.service";
import { UserStoryCustomAttributesService } from "@/features/user_stories/services/custom-attributes.service";
import type { Project } from "@/features/projects/models/projects.models";
import type { Milestone } from "@/features/milestones/models/milestones.models";
import type { UserStory } from "@/features/user_stories/models/user-stories.models";
import type {
  UserStoryCustomAttribute,
  UserStoryCustomAttributeValues,
} from "@/features/user_stories/models/custom-attributes.models";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import MainLayout from "@/layouts/MainLayout";

interface CustomAttributeData {
  attributes: UserStoryCustomAttribute[];
  values: Record<number, UserStoryCustomAttributeValues>;
}

export function GanttViewPage() {
  const { projectId, milestoneId } = useParams();
  const navigate = useNavigate();
  const ganttRef = useRef<HTMLDivElement>(null);
  const ganttInstance = useRef<any>(null);

  const [project, setProject] = useState<Project | null>(null);
  const [milestone, setMilestone] = useState<Milestone | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [customAttributeData, setCustomAttributeData] =
    useState<CustomAttributeData>({
      attributes: [],
      values: {},
    });
  const [ganttLoading, setGanttLoading] = useState(true);

  const useGanttScroll = (ref: React.RefObject<HTMLDivElement | null>) => {
    useEffect(() => {
      const element = ref.current;
      if (!element) return;

      const handleWheelEvent = (event: WheelEvent) => {
        if (event.shiftKey) {
          event.preventDefault();
          event.stopPropagation();
          element.scrollLeft += event.deltaY;
        } else {
          event.stopPropagation();
        }
      };

      element.addEventListener('wheel', handleWheelEvent, { 
        passive: false, 
        capture: true 
      });

      return () => {
        element.removeEventListener('wheel', handleWheelEvent, { capture: true });
      };
    }, [ref]);
  };

  useGanttScroll(ganttRef);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        if (!projectId || !milestoneId) {
          setError("Project ID and Milestone ID are required");
          return;
        }

        const projects = await ProjectsService.getMyUserProjects({
          slight: true,
          order_by: "user_order",
        });
        const currentProject = projects.find(
          (p) => p.id.toString() === projectId
        );
        if (!currentProject) {
          setError("Project not found");
          return;
        }
        setProject(currentProject);

        const projectMilestones = await MilestonesService.getProjectMilestones(
          currentProject.id,
          false
        );
        const currentMilestone = projectMilestones.find(
          (m) => m.id.toString() === milestoneId
        );
        if (!currentMilestone) {
          setError("Milestone not found");
          return;
        }
        setMilestone(currentMilestone);
      } catch (err: any) {
        setError(err.message || "Error loading data");
        console.error("Error fetching data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [projectId, milestoneId]);

  useEffect(() => {
    const loadCustomAttributes = async () => {
      if (
        !milestone?.user_stories ||
        milestone.user_stories.length === 0 ||
        !project
      ) {
        setGanttLoading(false);
        return;
      }

      try {
        setGanttLoading(true);

        const attributes =
          await UserStoryCustomAttributesService.getProjectCustomAttributes(
            project.id
          );

        const valuesPromises = milestone.user_stories.map(async (userStory) => {
          try {
            const values =
              await UserStoryCustomAttributesService.getCustomAttributeValues(
                userStory.id
              );
            return { userStoryId: userStory.id, values };
          } catch (error) {
            console.warn(
              `Failed to load custom attributes for user story ${userStory.id}:`,
              error
            );
            return { userStoryId: userStory.id, values: null };
          }
        });

        const valuesResults = await Promise.all(valuesPromises);
        const valuesMap: Record<number, UserStoryCustomAttributeValues> = {};

        valuesResults.forEach(({ userStoryId, values }) => {
          if (values) {
            valuesMap[userStoryId] = values;
          }
        });

        setCustomAttributeData({
          attributes,
          values: valuesMap,
        });
      } catch (error) {
        console.error("Failed to load custom attributes:", error);
      } finally {
        setGanttLoading(false);
      }
    };

    if (milestone && project) {
      loadCustomAttributes();
    }
  }, [milestone, project]);

  const formatDateForGantt = (dateString: string | null) => {
    if (!dateString) return null;
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return null;
  
      date.setDate(date.getDate() + 1);
  
      return date.toISOString().split("T")[0];
    } catch {
      return null;
    }
  };
  

  const getStartDate = (userStory: UserStory) => {
    const userStoryValues = customAttributeData.values[userStory.id];
    if (userStoryValues) {
      const startDateAttr = customAttributeData.attributes.find(
        (attr) => attr.name === "Start Date"
      );
      if (startDateAttr) {
        const startDate =
          userStoryValues.attributes_values[startDateAttr.id.toString()];
        if (startDate) {
          const formattedDate = formatDateForGantt(startDate);
          if (formattedDate) return formattedDate;
        }
      }
    }
    return formatDateForGantt(userStory.created_date);
  };

  const getProgress = (userStory: UserStory) => {
    if (userStory.is_closed) return 100;
    if (userStory.is_blocked) return 0;
    return 50;
  };

  useEffect(() => {
    if (
      !ganttLoading &&
      ganttRef.current &&
      milestone?.user_stories &&
      milestone.user_stories.length > 0
    ) {
      const tasks = milestone.user_stories
        .map((userStory) => {
          const startDate = getStartDate(userStory);
          const endDate = formatDateForGantt(userStory.due_date);

          if (!startDate || !endDate || !userStory.subject || !userStory.id) {
            return null;
          }

          return {
            id: userStory.id.toString(),
            name: userStory.subject.trim() || `Story ${userStory.id}`,
            start: startDate,
            end: endDate,
            progress: getProgress(userStory),
          };
        })
        .filter((task) => task !== null);

      if (tasks.length > 0) {
        console.log("Creating Gantt with tasks:", tasks);
        try {
          if (ganttInstance.current) {
            ganttInstance.current = null;
          }

          if (ganttRef.current) {
            ganttRef.current.innerHTML = "";
          }

          ganttInstance.current = new Gantt(ganttRef.current, tasks, {
            view_mode: "Day",
            date_format: "YYYY-MM-DD",
          });
        } catch (error) {
          console.error("Error creating Gantt chart:", error);
          console.error("Tasks data:", tasks);
        }
      }
    }

    return () => {
      if (ganttInstance.current) {
        ganttInstance.current = null;
      }
    };
  }, [ganttLoading, milestone?.user_stories, customAttributeData]);

  const handleBackToMilestones = () => {
    navigate(`/projects/${projectId}/milestones`);
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="text-center py-8">
          <div className="text-stone-500">Loading...</div>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="text-center py-8">
          <div className="text-red-600">Error: {error}</div>
          <Button onClick={handleBackToMilestones} className="mt-4">
            Back to Milestones
          </Button>
        </div>
      </MainLayout>
    );
  }

  if (!project || !milestone) {
    return (
      <MainLayout>
        <div className="text-center py-8">
          <div className="text-stone-500">Project or milestone not found</div>
          <Button onClick={handleBackToMilestones} className="mt-4">
            Back to Milestones
          </Button>
        </div>
      </MainLayout>
    );
  }

  const renderGanttChart = () => {
    if (ganttLoading) {
      return (
        <div className="text-center py-8">
          <div className="text-stone-500">Loading Gantt chart...</div>
        </div>
      );
    }

    if (!milestone?.user_stories || milestone.user_stories.length === 0) {
      return (
        <div className="text-center py-8">
          <div className="text-stone-500">
            No user stories to display in Gantt chart
          </div>
        </div>
      );
    }

    return (
      <div className="w-full flex flex-col items-center">
        <h3 className="text-lg font-semibold text-stone-900">
          {milestone?.name || "Milestone"} - Gantt Chart
        </h3>
        <p className="text-sm text-stone-600 mb-4">
          Timeline view of user stories with start dates and due dates
        </p>
        <p className="text-xs text-stone-500 mb-4">
          💡 Use scroll wheel for vertical scrolling • Shift + scroll wheel for horizontal scrolling
        </p>
        <div
          id="gantt"
          ref={ganttRef}
          className="border border-stone-200 rounded-lg overflow-auto max-w-screen"
          style={{ 
            maxHeight: '70vh',
            minHeight: '400px',
            width: '100%'
          }}
        />
      </div>
    );
  };

  return (
    <MainLayout>
      <div className="flex justify-between items-center mb-6">
        <Button onClick={handleBackToMilestones} variant="outline" size="sm">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Milestones
        </Button>
      </div>

      {renderGanttChart()}
    </MainLayout>
  );
}

export default GanttViewPage;
