import { Router } from "express";
import { validate } from "../../middlewares/validate";
import { requireAuth } from "../../middlewares/auth";
import { MissionController } from "./mission_controllers";
import type { MissionService } from "./mission.services";
import { createMissionSchema,missionParamSchema,updateMissionSchema } from "./mission.schema";

export function missionRouteFactory(service: MissionService): Router {
  const router = Router();
  const ctrl = MissionController(service);
  
  router.use(requireAuth);

  router.post("/",           validate(createMissionSchema), ctrl.create);
  router.get("/",                                           ctrl.list);
  router.get("/:questId",    validate(missionParamSchema),  ctrl.detail);
  router.patch("/:questId",  validate(updateMissionSchema), ctrl.update);
  router.delete("/:questId", validate(missionParamSchema),  ctrl.remove);

  return router;
}