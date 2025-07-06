import { Button } from '@/components/mockui/button'

import { useRouter } from 'next/navigation'
import React from 'react'

function InterviewItemCard({interviewInfo}) {
   const router=useRouter()
    const onStart=()=>{
        console.log("first")
       router.push(`/mock/dashboard/interview/${interviewInfo?.mockId}`)
    }
    const onFeedback=()=>{
        router.push(`/mock/dashboard/interview/${interviewInfo.mockId}/feedback`)
    }
    console.log(interviewInfo)
  return (
    <div className='border shadow-sm rounded-lg p-5 max-w-[500px] h-[250px] flex flex-col justify-between'>
      <div>
        <h2 className='font-semibold text-primary text-xl'>{interviewInfo?.jobPosition}</h2>
        <h2 className='text-lg text-gray-500'>Description: {interviewInfo.jobDesc}</h2>
        <h2 className=' text-gray-600 text-md pt-4'>{interviewInfo?.jobExperience} Years of Experience</h2>
        <h2 className='text-md text-gray-500'>Created At: {interviewInfo.createdAt}</h2>
      </div>
      <div>
        <div className='flex justify-between mt-2 gap-5'>
           
            <Button size="sm" variant="outline"  className="w-full" onClick={onFeedback}>Feedback</Button>
        
            <Button size="sm" className="w-full bg-blue-600 hover:bg-blue-700" onClick={onStart}>Start</Button>
        </div>
      </div>
    </div>
  )
}

export default InterviewItemCard