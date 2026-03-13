import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { NotificationService } from './notification.service';
import type { CheckInPayload } from './notification.interface';

@Controller()
export class NotificationController {
  constructor(private readonly notifService: NotificationService) {}

  /**
   * Mendengarkan event 'notification.check_in' yang di-emit oleh backend
   * setelah pegawai berhasil melakukan presensi masuk.
   *
   * Menggunakan @EventPattern (fire-and-forget) bukan @MessagePattern
   * agar backend tidak perlu menunggu respons dari microservice ini.
   */
  @EventPattern('notification.check_in')
  handleCheckIn(@Payload() payload: CheckInPayload) {
    return this.notifService.sendCheckInEmail(payload);
  }
}
