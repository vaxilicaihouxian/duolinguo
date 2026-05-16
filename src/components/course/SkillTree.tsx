import { Unit } from '@/types/course';
import { ProgressEntry } from '@/types/user';
import { getUnitProgress } from '@/services/CourseService';
import UnitNode from './UnitNode';
import styles from './SkillTree.module.css';

interface Props {
  units: Unit[];
  progress: Record<string, ProgressEntry>;
}

export default function SkillTree({ units, progress }: Props) {
  return (
    <div className={styles.tree}>
      {units.map((unit, index) => {
        const unitProgress = getUnitProgress(unit, progress, units);
        return (
          <UnitNode
            key={unit.id}
            unitProgress={unitProgress}
            progress={progress}
            isFirst={index === 0}
          />
        );
      })}
    </div>
  );
}
