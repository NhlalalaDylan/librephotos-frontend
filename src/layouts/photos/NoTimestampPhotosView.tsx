import {
  fetchNoTimestampPhotoPaginated,
} from "../../actions/photosActions";
import throttle from "lodash";
import React, { useEffect, useState, useCallback } from "react";
import _ from "lodash";
import { PhotoListView } from "../../components/photolist/PhotoListView";
import { PhotosetType, PhotosState } from "../../reducers/photosReducer";
import { useAppDispatch, useAppSelector } from "../../hooks";

export const NoTimestampPhotosView = () => {
  const { fetchedPhotosetType, numberOfPhotos, photosFlat } = useAppSelector((state) => state.photos as PhotosState);
  const dispatch = useAppDispatch();
  const [pages, setPages] = useState<number[]>([])
  
  useEffect(() => {
    if (fetchedPhotosetType !== PhotosetType.NO_TIMESTAMP && !pages.includes(1)) {
      setPages([...pages, 1]);
      fetchNoTimestampPhotoPaginated(dispatch, 1);
    }
  }, [dispatch]); // Only run on first render


  const getImages = (visibleItems: any) => {
    if (visibleItems.filter((i: any) => i.isTemp && i.isTemp != undefined).length > 0) {
      var firstTempObject = visibleItems.filter((i: any) => i.isTemp)[0];
      var page = Math.ceil((parseInt(firstTempObject.id) + 1) / 100);
      if (page > 1 && !pages.includes(page)) {
          setPages([...pages, page]);
          fetchNoTimestampPhotoPaginated(dispatch, page);
      }
    };
  }

  return (
      <PhotoListView
        title={"Photos without Timestamps"}
        loading={fetchedPhotosetType !== PhotosetType.NO_TIMESTAMP}
        titleIconName={"images outline"}
        isDateView={false}
        photoset={photosFlat}
        idx2hash={photosFlat}
        numberOfItems={numberOfPhotos}
        updateItems={(visibleItems: any) => 
          throttle((getImages(visibleItems), 500))
        }
        selectable={true}
      />
  
  );
}