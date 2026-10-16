import { BrowserRouter, Route, Routes } from 'react-router-dom'

import { BantuanPage } from '@/app/bantuan/BantuanPage'
import { CheckInPage } from '@/app/checkIn/CheckInPage'
import { EksplorasiPage } from '@/app/eksplorasi/EksplorasiPage'
import { InsightPage } from '@/app/insight/InsightPage'
import { LoginPage } from '@/app/auth/Login'
import { Phq9RegisterPage } from '@/app/auth/Register'
import { LittleMomentsPage } from '@/app/game/LittleMomentsPage'
import { Phq9IntroPage } from '@/app/questionnaire/IntroPage'
import { Phq9QuestionPage } from '@/app/questionnaire/QuestionnairePage'
import { ProfilPage } from '@/app/profil/ProfilPage'
import { QuestPage } from '@/app/quest/QuestPage'
import { RefleksiPage } from '@/app/refleksi/RefleksiPage'
import { ArticleDetailPage } from '@/app/topic/topicdetail'
import { TopicDetailPage as TopicDetailGuestPage } from '@/app/topic/TopicDetailGuest'
import { AppLayout } from '@/components/layout/AppLayout'
import { PagePlaceholder } from '@/components/ui/PagePlaceholder'
import { AuthProvider } from '@/lib/AuthProvider'
import { HomeRoute } from '@/main/HomeRoute'

export function Mainpage() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route element={<AppLayout />}>
            <Route index element={<HomeRoute />} />
            <Route path="guest" element={<HomeRoute forceGuest />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<Phq9RegisterPage />} />
            <Route path="phq-9" element={<Phq9IntroPage />} />
            <Route path="phq-9/assessment" element={<Phq9QuestionPage />} />
            <Route path="phq-9/question/:questionNumber" element={<Phq9QuestionPage />} />
            <Route path="topic/detail" element={<ArticleDetailPage />} />
            <Route path="topic/guest" element={<TopicDetailGuestPage />} />
            <Route path="check-in" element={<CheckInPage />} />
            <Route path="quest" element={<QuestPage />} />
            <Route path="game/little-moments" element={<LittleMomentsPage />} />
            <Route path="refleksi" element={<RefleksiPage />} />
            <Route path="insight" element={<InsightPage />} />
            <Route path="eksplorasi" element={<EksplorasiPage />} />
            <Route path="bantuan" element={<BantuanPage />} />
            <Route path="profil" element={<ProfilPage />} />
            <Route
              path="*"
              element={
                <PagePlaceholder
                  title="Halaman tidak ditemukan"
                  description="Alamat yang kamu tuju belum tersedia. Silakan kembali ke Beranda."
                />
              }
            />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
