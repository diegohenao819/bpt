// app/api/send-email/route.ts

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import sendgrid from '@sendgrid/mail'

sendgrid.setApiKey(process.env.SENDGRID_API_KEY as string)

export async function POST(req: NextRequest) {
  try {
    const { teacherEmail, studentName, studentScore, totalQuestions, studentGrade } = await req.json()

    const message = {
      to: teacherEmail,
      from: 'dialhenao@utp.edu.co', // Debe ser un correo verificado en SendGrid
      subject: 'Resultados del estudiante',
      text: `${studentName} ha obtenido una puntuación de ${studentScore}/${totalQuestions}.\nNota: ${studentGrade}/5.0`,
    }

    await sendgrid.send(message)

    return NextResponse.json({ message: 'Correo enviado exitosamente' }, { status: 200 })
  } catch (error) {
    console.error('Error al enviar el correo:', error)
    return NextResponse.json({ message: 'Error al enviar el correo' }, { status: 500 })
  }
}
