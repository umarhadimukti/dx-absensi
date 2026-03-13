import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import type { CheckInPayload } from './notification.interface';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);
  private readonly transporter: nodemailer.Transporter;

  constructor(private readonly config: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.config.get<string>('SMTP_HOST', 'sandbox.smtp.mailtrap.io'),
      port: this.config.get<number>('SMTP_PORT', 587),
      auth: {
        user: this.config.get<string>('SMTP_USER'),
        pass: this.config.get<string>('SMTP_PASS'),
      },
    });
  }

  async sendCheckInEmail(payload: CheckInPayload): Promise<{ success: boolean }> {
    const isLate = payload.status === 'TERLAMBAT';
    const statusLabel = isLate ? 'Terlambat' : 'Tepat Waktu';
    const statusColor = isLate ? '#d97706' : '#16a34a';
    const statusBg = isLate ? '#fffbeb' : '#f0fdf4';

    await this.transporter.sendMail({
      from: `"Dexa Absensi" <${this.config.get<string>('SMTP_FROM', 'noreply@dexa.com')}>`,
      to: payload.email,
      subject: `[Dexa Absensi] Check In ${statusLabel} – ${payload.tanggal}`,
      html: buildCheckInEmailHtml(payload, statusLabel, statusColor, statusBg),
    });

    this.logger.log(`Email check in terkirim → ${payload.email} (${payload.nama}) status=${payload.status}`);
    return { success: true };
  }
}

function buildCheckInEmailHtml(
  payload: CheckInPayload,
  statusLabel: string,
  statusColor: string,
  statusBg: string,
): string {
  return `
    <!DOCTYPE html>
    <html lang="id">
    <head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /></head>
    <body style="margin:0;padding:0;background:#f9fafb;font-family:Arial,sans-serif">
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;padding:32px 16px">
        <tr>
          <td align="center">
            <table width="480" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,.1)">

              <!-- Header -->
              <tr>
                <td style="background:#0ea5e9;padding:24px 32px">
                  <h1 style="margin:0;color:#ffffff;font-size:20px;font-weight:700">Dexa Absensi</h1>
                  <p style="margin:4px 0 0;color:#e0f2fe;font-size:13px">Sistem Manajemen Kehadiran Karyawan</p>
                </td>
              </tr>

              <!-- Body -->
              <tr>
                <td style="padding:28px 32px">
                  <p style="margin:0 0 8px;color:#374151;font-size:15px">Halo, <strong>${payload.nama}</strong></p>
                  <p style="margin:0 0 24px;color:#6b7280;font-size:14px">
                    Presensi masuk Anda telah berhasil dicatat. Berikut detailnya:
                  </p>

                  <!-- Info table -->
                  <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;font-size:14px">
                    <tr style="background:#f9fafb">
                      <td style="padding:10px 16px;color:#6b7280;width:120px">Tanggal</td>
                      <td style="padding:10px 16px;color:#111827;font-weight:600">${payload.tanggal}</td>
                    </tr>
                    <tr style="border-top:1px solid #e5e7eb">
                      <td style="padding:10px 16px;color:#6b7280">NIP</td>
                      <td style="padding:10px 16px;color:#111827">${payload.nip}</td>
                    </tr>
                    <tr style="border-top:1px solid #e5e7eb">
                      <td style="padding:10px 16px;color:#6b7280">Jam Masuk</td>
                      <td style="padding:10px 16px;color:#111827;font-weight:600">${payload.jam_masuk}</td>
                    </tr>
                    <tr style="border-top:1px solid #e5e7eb;background:${statusBg}">
                      <td style="padding:10px 16px;color:#6b7280">Status</td>
                      <td style="padding:10px 16px;color:${statusColor};font-weight:700">${statusLabel}</td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="background:#f9fafb;padding:16px 32px;border-top:1px solid #e5e7eb">
                  <p style="margin:0;color:#9ca3af;font-size:12px">
                    Email ini dikirim otomatis oleh sistem Dexa Absensi. Mohon tidak membalas email ini.
                  </p>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}
