import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Clock, MapPin, Headphones, AlertCircle, CheckCircle2, CupSoda, NotebookPen, IdCard, Moon, Podcast, Book, EarIcon, AlarmClock, Brain } from 'lucide-react'

export default function ExamInfo() {
  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold text-center mb-6">Exam Information</h1>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Bilingualism Proficiency Test (BPT)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-muted-foreground" />
            <span><strong>Date:</strong> November 26, 2024.</span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="h-5 w-5 text-muted-foreground" />
            <span><strong>Time:</strong> Please check your email for the assigned time slot.</span>
          </div>
          <div className="flex items-center space-x-2">
            <MapPin className="h-5 w-5 text-muted-foreground" />
            <span><strong>Location:</strong> Universidad Tecnológica de Pereira.</span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="h-5 w-5 text-muted-foreground" />
            <span><strong>Duration:</strong> Approximately 4 hours.</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">What to Bring</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            <li className="flex items-start space-x-2">
              <Headphones className="h-5 w-5 text-muted-foreground mt-1" />
              <span>Headphones or earphones with a jack (wired) – Bluetooth devices are not permitted.</span>
            </li>
            <li className="flex items-start space-x-2">
              <IdCard className="h-5 w-5 text-muted-foreground mt-1" />
              <span>Valid ID – A government-issued or university-issued ID is required for verification.</span>
            </li>
            <li className="flex items-start space-x-2">
              <NotebookPen className="h-5 w-5 text-muted-foreground mt-1" />
              <span>Pens and pencils – For the written portion and note-taking.</span>
            </li>
            <li className="flex items-start space-x-2">
              <CupSoda className="h-5 w-5 text-muted-foreground mt-1" />
              <span>Water bottle (optional) – Clear, label-free bottles only.</span>
            </li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Recommendations for Success</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            <li className="flex items-start space-x-2">
              <Moon className="h-5 w-5 text-muted-foreground mt-1" />
              <span>Sleep well the night before the exam to ensure you are fully alert.</span>
            </li>
            <li className="flex items-start space-x-2">
              <Podcast className="h-5 w-5 text-muted-foreground mt-1" />
              <span>Practice listening and speaking with authentic English materials such as podcasts, movies, or interviews.</span>
            </li>
            <li className="flex items-start space-x-2">
              <Book className="h-5 w-5 text-muted-foreground mt-1" />
              <span>Review vocabulary and grammar relevant to bilingual communication and proficiency tasks.</span>
            </li>
            <li className="flex items-start space-x-2">
              <EarIcon className="h-5 w-5 text-muted-foreground mt-1" />
              <span>Bring headphones tested in advance to avoid technical issues on exam day.</span>
            </li>
            <li className="flex items-start space-x-2">
              <AlarmClock className="h-5 w-5 text-muted-foreground mt-1" />
              <span>Arrive early to account for check-in and set-up time.</span>
            </li>
            <li className="flex items-start space-x-2">
              <Brain className="h-5 w-5 text-muted-foreground mt-1" />
              <span>Have a positive mindset and manage your time wisely during the test.</span>
            </li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Important Notes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start space-x-2">
            <AlertCircle className="h-5 w-5 text-muted-foreground mt-1" />
            <span>Mobile phones must be turned off and placed in a designated area during the exam.</span>
          </div>
          <div className="flex items-start space-x-2">
            <AlertCircle className="h-5 w-5 text-muted-foreground mt-1" />
            <span>Late arrivals may not be admitted, so plan your commute accordingly.</span>
          </div>
          <div className="flex items-start space-x-2">
            <AlertCircle className="h-5 w-5 text-muted-foreground mt-1" />
            <span>For any accessibility accommodations, please contact the exam office by November 20, 2024.</span>
          </div>
        </CardContent>
      </Card>

      <div className="text-center">
        <p className="text-lg font-semibold flex items-center justify-center">
          <CheckCircle2 className="h-6 w-6 text-green-500 mr-2" />
          Good luck! 
        </p>
      </div>
    </div>
  )
}