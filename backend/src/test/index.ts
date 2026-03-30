import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { HTTP_STATUS_BAD_REQUEST } from "../../../constant";
import { HandleException } from "../../../lib";
import { InterviewRoomUseCase } from "../../../usecase/room.usecase";
import { CreateRoomPayload } from "../../payload/rooms/createRoom.payload";
import { CreateRoomData } from "../../response/room/createRoom";

const createRoom = async (
  req: Request,
  res: Response,
  service: InterviewRoomUseCase,
) => {
  try {
    const validate = validationResult(req);
    if (!validate.isEmpty()) {
      HandleException(
        res,
        HTTP_STATUS_BAD_REQUEST,
        validate
          .array()
          .map((error) => error.msg)
          .join(", "),
      );
      return;
    }

    const payload: CreateRoomPayload = {
      jobId: req.body.jobId,
      candidateId: req.body.candidateId,
      interviewerIds: req.body.interviewerIds,
      title: req.body.title,
      scheduledDate: req.body.scheduledDate,
      durationMinutes: req.body.durationMinutes,
      createdBy: String(req.user!.id),
    };

    const result = await service.createRoom(payload);

    const response: CreateRoomData = {
      status: "success",
      message: "Room created successfully",
      data: result,
      errors: null,
    };

    res.json(response);
  } catch (error: any) {
    const statusCode = error.statusCode || HTTP_STATUS_BAD_REQUEST;
    HandleException(res, statusCode, error.message);
  }
};

const updateRoom = "updateRoom";

export default {
  createRoom,
};

// tôi đã sửa