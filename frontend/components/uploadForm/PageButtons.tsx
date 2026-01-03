'use client'
import { PostUploadPage } from '@/Types/types';
import React, { Dispatch, SetStateAction } from 'react'

const PageButtons = ({pages,SetPages}:{pages:PostUploadPage,SetPages:Dispatch<SetStateAction<PostUploadPage>>}) => {
    const isLastPage = pages === PostUploadPage.page3;
    const isfirstPage = pages === PostUploadPage.page1;
    
    const handleNext = () => {
        if (pages === PostUploadPage.page1) SetPages(PostUploadPage.page2);
        else if (pages === PostUploadPage.page2) SetPages(PostUploadPage.page3);
    };

    const handleBack = () => {
        if(pages === PostUploadPage.page3)SetPages(PostUploadPage.page2);
        else if(pages === PostUploadPage.page2)SetPages(PostUploadPage.page1);
    };
    return (
        <div className='flex justify-between sm:justify-center px-3 w-full gap-3'>
            {(isLastPage || !isfirstPage) && 
                <button
                    onClick={handleBack}
                    className="px-3 py-0.5 max-w-20 bg-zinc-800 p-1 rounded-md w-full font-semibold text-md transition-all duration-300 ease-in-out hover:scale-108"
                    >
                    Back
                </button>
            }
            {(isfirstPage || !isLastPage) && 
                <button
                    onClick={handleNext}
                    className="bg-gradient-to-bl px-3 py-0.5 max-w-20 hover:bg-gradient-to-tr from-[#1ed1db] to-[#2daaae] p-1 rounded-md w-full hover:scale-108 font-semibold text-md transition-all duration-300 ease-in-out"
                    >
                    Next
                </button>
            }
        </div>
    )
}

export default PageButtons
