<template>
    <div v-if="!loading && currentParticipants?.length">
        <XCard 
            v-for="participant in currentParticipants"
            :key="participant.code"
            class="border border-gray-400 flex gap-2 text-gray-900"
        >
            <template #header>
                <div class="flex justify-between items-start">
                    <!-- Parte izquierda: Logo + Nombre -->
                    <div class="flex gap-12">
                        <XAvatar
                            v-if="participant.urlIcon"
                            :image="participant.urlIcon"
                            class="w-20 h-20"
                        />
                        <Icon v-else name="x:media-image" class="w-20 h-20 text-gray-400" />
                        <div>
                            <p class="text-sm text-gray-500">Entidad</p>
                            <p class="text-base font-semibold text-gray-900">{{ participant.name }}</p>
                        </div>
                    </div>
                    <XButton label="Editar banco" icon="edit-pencil" variant="text" class="flex items-center gap-1" />
                </div>
            </template>
            <template #content>
                <div class="grid grid-cols-3 mt-12">
                    <div class="flex-col gap-2">
                        <p class="font-sm text-gray-600">Código</p>
                        <span class="font-lg font-semi bold">{{ participant.code }}</span>
                    </div>
                    <div class="flex-col gap-2">
                        <p class="font-sm text-gray-600">Siglas</p>
                        <span class="font-lg font-semi bold">{{ participant.acronym }}</span>
                    </div> 
                    <div class="flex-col gap-2">
                        <p class="font-sm text-gray-600">Canales</p>
                        <span class="font-lg font-semi bold">
                            {{ formatPaymentSystems(participant.paymentSystems) }}
                        </span>
                    </div>
                </div>
            </template>
            <template #footer>
            <div class="mt-6  flex justify-end">
                <XButton label="Ver canales"  variant="outlined" class="w-65"/>
                </div>
            </template>
        </XCard>
    </div>
</template>

<script setup lang="ts">
import { XButton, XCard } from '#components';
import type { ParticipantsDetail } from '~/features/participants/types';

type ParticipantMode = 'ownParticipants' | 'externalParticipants';

interface Props {
    participants: {
        ownParticipants: ParticipantsDetail[];
        externalParticipants: ParticipantsDetail[];
    };
    mode: ParticipantMode;
    loading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
    loading: false,
});

const currentParticipants = computed(() => {
    return props.participants[props.mode];
});

const formatPaymentSystems = (paymentSystems?: Array<{ paymentSystemAcronym: string }>) => {
    if (!paymentSystems?.length) return 'Ninguno';
    return paymentSystems.map(sys => sys.paymentSystemAcronym).join(' / ');
};

</script>

<style scoped>

</style>