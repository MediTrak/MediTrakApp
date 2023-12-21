// BottomSheetComponent.js
import React, { forwardRef, useCallback, useMemo, useRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BottomSheetModal } from '@gorhom/bottom-sheet';

type Ref = BottomSheetModal

interface Props {
    initialIndex?: number;
    snapPoints: any[]; 
    children: React.ReactNode;
    id?: string; 
}

const BottomSheetComponent = forwardRef<Ref, Props>(( props, ref ) => {
    // ref
    const bottomSheetRef = useRef<BottomSheetModal>(null);

    // callbacks
    const handleSheetChanges = useCallback((index: number) => {
        console.log('handleSheetChanges', index);
    }, []);

    // renders
    return (
        <BottomSheetModal
            ref={ref}
            index={0}
            snapPoints={props.snapPoints}
            onChange={handleSheetChanges}
            enablePanDownToClose={true}
            key={props.id}
        >
            {props.children}
        </BottomSheetModal>
    );
});

const styles = StyleSheet.create({
    contentContainer: {
        flex: 1,
        alignItems: 'center',
    },
});

export default BottomSheetComponent;
