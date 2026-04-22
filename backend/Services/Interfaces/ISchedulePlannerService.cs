using backend.DTOs;
using System.Security.Claims;

namespace backend.Services.Interfaces;

public interface ISchedulePlannerService
{
    Task<object> GetScheduleOptionsAsync();

    Task<object> GetAvailabilityAsync(int maLop, DateOnly ngayHoc, int? maGiaoVien = null);

    Task<(bool Success, object Payload, int StatusCode)> CreateManualScheduleAsync(
        ScheduleManualCreateDto dto,
        ClaimsPrincipal user);

    Task<(bool Success, object Payload, int StatusCode)> CreateAutoScheduleAsync(
        ScheduleAutoCreateDto dto,
        ClaimsPrincipal user);

    Task<(bool Success, object Payload, int StatusCode)> ProcessRescheduleRequestAsync(
        int maYeuCau,
        AdminRescheduleProcessDto dto,
        ClaimsPrincipal user);
}
